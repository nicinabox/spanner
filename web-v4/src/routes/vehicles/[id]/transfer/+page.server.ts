import { getVehicle } from '$lib/data/vehicles';
import { decode, validate } from '$lib/utils/formData';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import * as v from 'valibot';
import { importHistory } from '$lib/data/history';

const importSchema = v.object({
	importFile: v.pipe(v.file(), v.mimeType(['text/csv', 'application/vnd.ms-excel', 'text/plain'])),
	fuelly: v.optional(v.boolean()),
});

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	return { vehicle };
};

export const actions = {
	import: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), importSchema);
		if (parsed.errors) {
			return fail(422, {
				errors: [{ id: 'form', title: 'Please select a valid CSV file to import' }],
			});
		}

		try {
			await importHistory(params.id!, formData, locals);
		} catch {
			return fail(422, {
				errors: [
					{
						id: 'form',
						title: 'Import failed. Check that your CSV has the correct format and try again.',
					},
				],
			});
		}

		redirect(303, `/vehicles/${params.id}`);
	},
} satisfies Actions;
