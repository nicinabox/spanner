import { ATTACHMENT_SIZE_LIMIT, MAX_ATTACHMENTS } from '$lib/data/attachments';
import { numberSchema } from '$lib/schemas';
import * as v from 'valibot';

export const attachmentFileSchema = v.pipe(
	v.file(),
	v.minSize(1),
	v.maxSize(ATTACHMENT_SIZE_LIMIT),
);
export const attachmentsSchema = v.pipe(
	v.array(attachmentFileSchema),
	v.maxLength(MAX_ATTACHMENTS),
);

export const recordFormSchema = v.object({
	date: v.pipe(v.string('Date is required'), v.minLength(1, 'Date is required')),
	notes: v.pipe(v.string('Notes is required'), v.minLength(1, 'Notes is required')),
	mileage: v.optional(numberSchema),
	cost: v.optional(numberSchema),
	classificationIds: v.optional(v.union([v.string(), v.array(v.string())])),
	attachments: v.optional(attachmentsSchema),
});

export type RecordFormData = v.InferOutput<typeof recordFormSchema>;
