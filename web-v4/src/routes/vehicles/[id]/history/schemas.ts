import { numberSchema } from '$lib/schemas';
import * as v from 'valibot';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_FILES = 10;

export const attachmentFileSchema = v.pipe(v.file(), v.minSize(1), v.maxSize(MAX_FILE_SIZE));
export const attachmentsSchema = v.pipe(v.array(attachmentFileSchema), v.maxLength(MAX_FILES));

export const recordFormSchema = v.object({
	date: v.pipe(v.string('Date is required'), v.minLength(1, 'Date is required')),
	notes: v.pipe(v.string('Notes is required'), v.minLength(1, 'Notes is required')),
	mileage: v.optional(numberSchema),
	cost: v.optional(numberSchema),
	classificationIds: v.optional(v.union([v.string(), v.array(v.string())])),
	attachments: v.optional(attachmentsSchema),
});

export type RecordFormData = v.InferOutput<typeof recordFormSchema>;
