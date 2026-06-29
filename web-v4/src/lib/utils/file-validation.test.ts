import { describe, it, expect } from 'vitest';
import { validateAttachmentFile, validateImportFile, validateAttachments } from './file-validation';

/** Build a File with a specific magic-byte header followed by filler content. */
function fileFromHeader(name: string, header: number[], size?: number, type = ''): File {
	const content = new Uint8Array(size ?? header.length);
	content.set(header);
	for (let i = header.length; i < content.length; i++) {
		content[i] = 0x41; // filler
	}
	return new File([content], name, { type });
}

describe('validateAttachmentFile', () => {
	const MAX_SIZE = 10 * 1024 * 1024;

	it('accepts a valid PDF', async () => {
		const file = fileFromHeader('doc.pdf', [0x25, 0x50, 0x44, 0x46], 100, 'application/pdf');
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(true);
		if (result.valid) expect(result.mime).toBe('application/pdf');
	});

	it('accepts a valid JPEG', async () => {
		const file = fileFromHeader('photo.jpg', [0xff, 0xd8, 0xff], 100, 'image/jpeg');
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(true);
		if (result.valid) expect(result.mime).toBe('image/jpeg');
	});

	it('accepts a valid PNG', async () => {
		const file = fileFromHeader(
			'img.png',
			[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
			100,
			'image/png'
		);
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(true);
		if (result.valid) expect(result.mime).toBe('image/png');
	});

	it('accepts a valid GIF', async () => {
		const file = fileFromHeader('anim.gif', [0x47, 0x49, 0x46, 0x38], 100, 'image/gif');
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(true);
		if (result.valid) expect(result.mime).toBe('image/gif');
	});

	it('accepts a valid WebP (RIFF + WEBP)', async () => {
		const header = [
			0x52, 0x49, 0x46, 0x46, // RIFF
			0x00, 0x00, 0x00, 0x00, // file size (placeholder)
			0x57, 0x45, 0x42, 0x50 // WEBP
		];
		const file = fileFromHeader('img.webp', header, 100, 'image/webp');
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(true);
		if (result.valid) expect(result.mime).toBe('image/webp');
	});

	it('rejects RIFF without WEBP brand (e.g. WAV disguised as WebP)', async () => {
		const header = [
			0x52, 0x49, 0x46, 0x46, // RIFF
			0x00, 0x00, 0x00, 0x00,
			0x57, 0x41, 0x56, 0x45 // WAVE — not WEBP
		];
		const file = fileFromHeader('audio.webp', header, 100, 'image/webp');
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
	});

	it('accepts a valid HEIC (ftyp + heic brand)', async () => {
		const header = [
			0x00, 0x00, 0x00, 0x20, // box size
			0x66, 0x74, 0x79, 0x70, // ftyp
			0x68, 0x65, 0x69, 0x63 // heic
		];
		const file = fileFromHeader('photo.heic', header, 100, 'image/heic');
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(true);
		if (result.valid) expect(result.mime).toBe('image/heic');
	});

	it('accepts HEIC with mif1 brand', async () => {
		const header = [
			0x00, 0x00, 0x00, 0x20,
			0x66, 0x74, 0x79, 0x70, // ftyp
			0x6d, 0x69, 0x66, 0x31 // mif1
		];
		const file = fileFromHeader('photo.heic', header, 100, 'image/heic');
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(true);
	});

	it('rejects ftyp with unknown brand', async () => {
		const header = [
			0x00, 0x00, 0x00, 0x20,
			0x66, 0x74, 0x79, 0x70, // ftyp
			0x6d, 0x70, 0x34, 0x32 // mp42 — QuickTime, not HEIC
		];
		const file = fileFromHeader('video.heic', header, 100, 'image/heic');
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
	});

	it('rejects an empty file', async () => {
		const file = new File([], 'empty.pdf', { type: 'application/pdf' });
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('empty');
	});

	it('rejects a file exceeding max size', async () => {
		const file = fileFromHeader('big.pdf', [0x25, 0x50, 0x44, 0x46], 11 * 1024 * 1024);
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('exceeds');
	});

	it('rejects a ZIP archive', async () => {
		const file = fileFromHeader('malware.pdf', [0x50, 0x4b, 0x03, 0x04], 100, 'application/pdf');
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('archive');
	});

	it('rejects a GZ archive', async () => {
		const file = fileFromHeader('payload.pdf', [0x1f, 0x8b], 100, 'application/pdf');
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('archive');
	});

	it('rejects a 7z archive', async () => {
		const file = fileFromHeader(
			'archive.pdf',
			[0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c],
			100,
			'application/pdf'
		);
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('archive');
	});

	it('rejects an executable disguised as PDF', async () => {
		// MZ header (Windows PE executable)
		const file = fileFromHeader('trojan.pdf', [0x4d, 0x5a], 100, 'application/pdf');
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('unrecognized');
	});

	it('rejects a file with a truncated header', async () => {
		// Only 2 bytes, not enough for any signature
		const file = fileFromHeader('short.bin', [0x00, 0x00], 2);
		const result = await validateAttachmentFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
	});
});

describe('validateImportFile', () => {
	const MAX_SIZE = 10 * 1024 * 1024;

	it('accepts a valid CSV file', async () => {
		const csv = new File(['date,notes,mileage\n2024-01-01,Oil change,5000\n'], 'import.csv', {
			type: 'text/csv'
		});
		const result = await validateImportFile(csv, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(true);
	});

	it('rejects an empty file', async () => {
		const file = new File([], 'empty.csv');
		const result = await validateImportFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('empty');
	});

	it('rejects an oversized file', async () => {
		const file = fileFromHeader('big.csv', [0x64, 0x61, 0x74, 0x65], 11 * 1024 * 1024);
		const result = await validateImportFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('exceeds');
	});

	it('rejects a ZIP archive', async () => {
		const file = fileFromHeader('import.csv', [0x50, 0x4b, 0x03, 0x04], 100, 'text/csv');
		const result = await validateImportFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('archive');
	});

	it('rejects a PDF disguised as CSV', async () => {
		const file = fileFromHeader('import.csv', [0x25, 0x50, 0x44, 0x46], 100, 'text/csv');
		const result = await validateImportFile(file, { maxSize: MAX_SIZE });
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('application/pdf');
	});
});

describe('validateAttachments', () => {
	it('accepts multiple valid files under the limit', async () => {
		const files = [
			fileFromHeader('a.pdf', [0x25, 0x50, 0x44, 0x46], 100),
			fileFromHeader('b.jpg', [0xff, 0xd8, 0xff], 100)
		];
		const result = await validateAttachments(files);
		expect(result.valid).toBe(true);
	});

	it('rejects more than 10 files', async () => {
		const files = Array.from({ length: 11 }, (_, i) =>
			fileFromHeader(`file${i}.pdf`, [0x25, 0x50, 0x44, 0x46], 100)
		);
		const result = await validateAttachments(files);
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('Maximum 10');
	});

	it('returns the first invalid file error', async () => {
		const files = [
			fileFromHeader('good.pdf', [0x25, 0x50, 0x44, 0x46], 100),
			fileFromHeader('bad.exe', [0x4d, 0x5a], 100)
		];
		const result = await validateAttachments(files);
		expect(result.valid).toBe(false);
		if (!result.valid) expect(result.reason).toContain('bad.exe');
	});

	it('accepts an empty array', async () => {
		const result = await validateAttachments([]);
		expect(result.valid).toBe(true);
	});
});