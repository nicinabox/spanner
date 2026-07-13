import { getVehicle } from '$lib/data/vehicles';
import { createHistoryEntry } from '$lib/data/history';
import { uploadRecord, toMultipartFormData } from '$lib/data/multipart';
import { createVehicleReminder, deleteReminder } from '$lib/data/reminders';
import { getClassifications } from '$lib/data/classifications';
import { createServiceSchedule, type CreateServiceScheduleData } from '$lib/data/serviceSchedules';
import { withActionErrors } from '$lib/utils/actions';
import { parseForm } from '$lib/utils/schema';
import { validateAttachments } from '$lib/utils/file-validation';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { reminderFormSchema } from '../reminders/schemas';
import { recordFormSchema } from '../history/schemas';
import * as v from 'valibot';
import type { PageServerLoad } from './$types';

const mileageAdjustmentSchema = v.object({
	mileage: v.nullish(
		v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))),
		null,
	),
});

const scheduleFormSchema = v.object({
	classificationId: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
	name: v.optional(v.string(''), ''),
	keywords: v.optional(v.string(''), ''),
	distanceInterval: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
	monthInterval: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
	notes: v.optional(v.string(''), ''),
});

export const load: PageServerLoad = async ({ locals, params }) => {
	const [vehicle, classifications] = await Promise.all([
		getVehicle(params.id!, locals),
		getClassifications(params.id!, locals),
	]);

	if (vehicle.retired) {
		redirect(303, `/vehicles/${params.id}`);
	}

	return { vehicle, classifications };
};

export const actions = {
	record: withActionErrors(async ({ request, locals, params, url }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, recordFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		// Read attachments and classification IDs after schema parse so the
		// iterator isn't disturbed by the FormData → entries conversion.
		const files = formData.getAll('record[attachments][]') as File[];
		const classificationIds = formData.getAll('record[classification_ids][]');

		const validation = await validateAttachments(files);
		if (!validation.valid) {
			return fail(422, {
				errors: [{ id: 'attachments', title: validation.reason }],
			});
		}

		const body = toMultipartFormData(
			{
				date: parsed.data.date,
				notes: parsed.data.notes,
				mileage: parsed.data.mileage,
				cost: parsed.data.cost,
			},
			{ prefix: 'record' },
		);
		for (const file of files) {
			body.append('record[attachments][]', file);
		}
		for (const id of classificationIds) {
			body.append('record[classification_ids][]', id);
		}

		const reminderId = url.searchParams.get('reminder_id');

		await uploadRecord(params.id!, undefined, body, locals);
		if (reminderId) {
			await deleteReminder(params.id!, reminderId, locals);
		}

		redirect(303, `/vehicles/${params.id}`);
	}),

	reminder: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, reminderFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await createVehicleReminder(
			params.id!,
			{
				notes: parsed.data.notes,
				reminderType: parsed.data.reminderType || null,
				date: parsed.data.date || null,
				mileage: parsed.data.mileage ?? null,
			} as never,
			locals,
		);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),

	mileageAdjustment: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, mileageAdjustmentSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });
		if (typeof parsed.data.mileage !== 'number') {
			return fail(400, { errors: [{ id: 'mileage', title: 'Mileage is required' }] });
		}

		await createHistoryEntry(
			params.id!,
			{
				date: new Date().toISOString().split('T')[0],
				notes: 'Mileage adjustment',
				mileage: parsed.data.mileage,
				recordType: 'mileage adjustment',
			} as never,
			locals,
		);
		redirect(303, `/vehicles/${params.id}`);
	}),

	schedule: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, scheduleFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		const { classificationId, name } = parsed.data;

		if (!classificationId && !name) {
			return fail(400, {
				errors: [{ id: 'classificationId', title: 'Select or create a service' }],
			});
		}

		if (!parsed.data.distanceInterval && !parsed.data.monthInterval) {
			return fail(400, {
				errors: [{ id: 'form', title: 'Set a distance or month interval' }],
			});
		}

		const scheduleData: CreateServiceScheduleData['serviceSchedule'] = {
			distanceInterval: parsed.data.distanceInterval,
			monthInterval: parsed.data.monthInterval,
			notes: parsed.data.notes || null,
		};

		if (name) {
			const keywords = (parsed.data.keywords || '')
				.split(',')
				.map((k: string) => k.trim())
				.filter(Boolean);
			scheduleData.classificationName = name;
			scheduleData.keywords = keywords;
		} else {
			scheduleData.classificationId = classificationId ?? undefined;
		}

		await createServiceSchedule(params.id!, { serviceSchedule: scheduleData }, locals);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),
} satisfies Actions;
