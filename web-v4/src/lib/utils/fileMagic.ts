// Magic byte signatures for file type detection

type MagicSignature = { bytes: Uint8Array; offset: number };

interface MagicEntry {
	mime: string;
	required: MagicSignature[];
	anyOf?: { signatures: Uint8Array[]; offset: number };
}

export const MAGIC_BYTES: MagicEntry[] = [
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

export const ARCHIVE_SIGNATURES: Uint8Array[] = [
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

export function detectMimeType(data: Uint8Array): string | null {
	for (const entry of MAGIC_BYTES) {
		const requiredMatch = entry.required.every((s) => bytesMatch(data, s.bytes, s.offset));
		if (!requiredMatch) continue;

		if (entry.anyOf) {
			if (
				entry.anyOf.signatures.some((sig) => bytesMatch(data, sig, entry.anyOf!.offset))
			) {
				return entry.mime;
			}
			continue;
		}

		return entry.mime;
	}
	return null;
}

export function isArchive(data: Uint8Array): boolean {
	return ARCHIVE_SIGNATURES.some((sig) => bytesMatch(data, sig));
}

export async function readFileHeader(file: File): Promise<Uint8Array> {
	const header = await file.slice(0, 16).arrayBuffer();
	return new Uint8Array(header);
}
