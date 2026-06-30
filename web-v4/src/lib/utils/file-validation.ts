const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

type MagicSignature = { bytes: Uint8Array; offset: number };

interface MagicEntry {
	mime: string;
	// ALL required signatures must match
	required: MagicSignature[];
	// If set, at least one alternative signature must also match (at given offset)
	anyOf?: { signatures: Uint8Array[]; offset: number };
}

const MAGIC_BYTES: MagicEntry[] = [
	{
		mime: 'application/pdf',
		required: [{ bytes: new Uint8Array([0x25, 0x50, 0x44, 0x46]), offset: 0 }], // %PDF
	},
	{
		mime: 'image/jpeg',
		required: [{ bytes: new Uint8Array([0xff, 0xd8, 0xff]), offset: 0 }],
	},
	{
		mime: 'image/png',
		required: [
			{ bytes: new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), offset: 0 },
		],
	},
	{
		mime: 'image/gif',
		required: [{ bytes: new Uint8Array([0x47, 0x49, 0x46, 0x38]), offset: 0 }], // GIF8
	},
	{
		mime: 'image/webp',
		required: [
			{ bytes: new Uint8Array([0x52, 0x49, 0x46, 0x46]), offset: 0 }, // RIFF
			{ bytes: new Uint8Array([0x57, 0x45, 0x42, 0x50]), offset: 8 }, // WEBP
		],
	},
	{
		mime: 'image/heic',
		required: [{ bytes: new Uint8Array([0x66, 0x74, 0x79, 0x70]), offset: 4 }], // ftyp
		anyOf: {
			offset: 8,
			signatures: [
				new Uint8Array([0x68, 0x65, 0x69, 0x63]), // heic
				new Uint8Array([0x68, 0x65, 0x69, 0x78]), // heix
				new Uint8Array([0x6d, 0x69, 0x66, 0x31]), // mif1
				new Uint8Array([0x68, 0x65, 0x76, 0x63]), // hevc
			],
		},
	},
];

const ARCHIVE_SIGNATURES: Uint8Array[] = [
	new Uint8Array([0x50, 0x4b, 0x03, 0x04]), // ZIP
	new Uint8Array([0x50, 0x4b, 0x05, 0x06]), // ZIP (empty)
	new Uint8Array([0x50, 0x4b, 0x07, 0x08]), // ZIP (spanned)
	new Uint8Array([0x1f, 0x8b]), // GZ
	new Uint8Array([0x42, 0x5a, 0x68]), // BZ2
	new Uint8Array([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]), // 7z
	new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07]), // RAR
];

function bytesMatch(data: Uint8Array, signature: Uint8Array, offset = 0): boolean {
	if (data.length < offset + signature.length) return false;
	for (let i = 0; i < signature.length; i++) {
		if (data[offset + i] !== signature[i]) return false;
	}
	return true;
}

function detectMimeType(data: Uint8Array): string | null {
	for (const entry of MAGIC_BYTES) {
		const requiredMatch = entry.required.every((s) => bytesMatch(data, s.bytes, s.offset));
		if (!requiredMatch) continue;

		if (entry.anyOf) {
			if (entry.anyOf.signatures.some((sig) => bytesMatch(data, sig, entry.anyOf!.offset))) {
				return entry.mime;
			}
			continue;
		}

		return entry.mime;
	}
	return null;
}

function isArchive(data: Uint8Array): boolean {
	return ARCHIVE_SIGNATURES.some((sig) => bytesMatch(data, sig));
}

export type ValidationResult = { valid: true; mime: string } | { valid: false; reason: string };

export async function validateAttachmentFile(
	file: File,
	options?: { maxSize?: number },
): Promise<ValidationResult> {
	if (file.size === 0) {
		return { valid: false, reason: `"${file.name}" is empty` };
	}

	if (options?.maxSize && file.size > options.maxSize) {
		return {
			valid: false,
			reason: `"${file.name}" exceeds ${formatBytes(options.maxSize)} limit`,
		};
	}

	// Read first 16 bytes for magic byte detection
	const header = await file.slice(0, 16).arrayBuffer();
	const data = new Uint8Array(header);

	if (isArchive(data)) {
		return {
			valid: false,
			reason: `"${file.name}" is an archive file (ZIP, GZ, etc.) which is not allowed`,
		};
	}

	const detected = detectMimeType(data);
	if (!detected) {
		return {
			valid: false,
			reason: `"${file.name}" has an unrecognized file type. Allowed: PDF, JPEG, PNG, GIF, WebP, HEIC`,
		};
	}

	return { valid: true, mime: detected };
}

export async function validateImportFile(
	file: File,
	options?: { maxSize?: number },
): Promise<{ valid: true } | { valid: false; reason: string }> {
	if (file.size === 0) {
		return { valid: false, reason: 'Import file is empty' };
	}

	if (options?.maxSize && file.size > options.maxSize) {
		return {
			valid: false,
			reason: `Import file exceeds ${formatBytes(options.maxSize)} limit`,
		};
	}

	// Read first 16 bytes to check for binary/archive signatures
	const header = await file.slice(0, 16).arrayBuffer();
	const data = new Uint8Array(header);

	if (isArchive(data)) {
		return {
			valid: false,
			reason: 'Import file is an archive (ZIP, GZ, etc.) which is not allowed',
		};
	}

	// Reject if it matches known binary formats (not CSV)
	const detected = detectMimeType(data);
	if (detected) {
		return {
			valid: false,
			reason: `Import file appears to be a ${detected} file, not a CSV`,
		};
	}

	return { valid: true };
}

/**
 * Validate a batch of attachment files (file count + per-file validation).
 * Returns the first validation error encountered, or null if all files are valid.
 */
export async function validateAttachments(
	files: File[],
	options?: { maxSize?: number; maxFiles?: number },
): Promise<{ valid: true } | { valid: false; reason: string }> {
	const maxFiles = options?.maxFiles ?? MAX_FILES;
	const maxSize = options?.maxSize ?? MAX_FILE_SIZE;

	if (files.length > maxFiles) {
		return { valid: false, reason: `Maximum ${maxFiles} files per record` };
	}

	for (const file of files) {
		const result = await validateAttachmentFile(file, { maxSize });
		if (!result.valid) {
			return result;
		}
	}

	return { valid: true };
}

function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
	const value = bytes / Math.pow(1024, i);
	const decimals = i === 0 ? 0 : i <= 2 ? 1 : 2;
	return `${value.toFixed(decimals)} ${units[i]}`;
}
