const MAGIC_BYTES: Record<string, Uint8Array[]> = {
	// Documents
	'application/pdf': [new Uint8Array([0x25, 0x50, 0x44, 0x46])], // %PDF
	// Images
	'image/jpeg': [new Uint8Array([0xff, 0xd8, 0xff])],
	'image/png': [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
	'image/gif': [new Uint8Array([0x47, 0x49, 0x46, 0x38])], // GIF8
	'image/webp': [new Uint8Array([0x52, 0x49, 0x46, 0x46])], // RIFF (WebP container)
	'image/heic': [new Uint8Array([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70])], // ftyp box
};

const ARCHIVE_SIGNATURES: Uint8Array[] = [
	new Uint8Array([0x50, 0x4b, 0x03, 0x04]), // ZIP
	new Uint8Array([0x50, 0x4b, 0x05, 0x06]), // ZIP (empty)
	new Uint8Array([0x50, 0x4b, 0x07, 0x08]), // ZIP (spanned)
	new Uint8Array([0x1f, 0x8b]), // GZ
	new Uint8Array([0x42, 0x5a, 0x68]), // BZ2
	new Uint8Array([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]), // 7z
	new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07]), // RAR
];

function bytesMatch(data: Uint8Array, signature: Uint8Array): boolean {
	if (data.length < signature.length) return false;
	for (let i = 0; i < signature.length; i++) {
		if (data[i] !== signature[i]) return false;
	}
	return true;
}

function detectMimeType(data: Uint8Array): string | null {
	for (const [mime, signatures] of Object.entries(MAGIC_BYTES)) {
		for (const sig of signatures) {
			if (bytesMatch(data, sig)) return mime;
		}
	}
	return null;
}

function isArchive(data: Uint8Array): boolean {
	return ARCHIVE_SIGNATURES.some((sig) => bytesMatch(data, sig));
}

export type FileValidationError = {
	reason: string;
};

export async function validateAttachmentFile(
	file: File,
	options?: { maxSize?: number }
): Promise<{ valid: true; mime: string } | { valid: false; reason: string }> {
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
	options?: { maxSize?: number }
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

function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
	const value = bytes / Math.pow(1024, i);
	const decimals = i === 0 ? 0 : i <= 2 ? 1 : 2;
	return `${value.toFixed(decimals)} ${units[i]}`;
}
