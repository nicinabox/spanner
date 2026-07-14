import { request } from './server';
import type { RequestOpts } from './types';

export interface Attachment {
	id: string;
	filename: string;
	contentType: string;
	byteSize: number;
	url: string;
}

export const ATTACHMENT_SIZE_LIMIT = 10 * 1024 * 1024;
export const MAX_ATTACHMENTS = 10;

export function deleteAttachment(
	vehicleId: string | number,
	recordId: string | number,
	signedId: string,
	opts: RequestOpts,
) {
	return request(`/vehicles/${vehicleId}/records/${recordId}/attachments/${signedId}`, {
		...opts,
		method: 'DELETE',
	});
}
