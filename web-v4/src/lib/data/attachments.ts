export interface Attachment {
	id: string;
	filename: string;
	contentType: string;
	byteSize: number;
	url: string;
}

export const ATTACHMENT_SIZE_LIMIT = 10 * 1024 * 1024;
