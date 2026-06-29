import { getVehicle } from '$lib/data/vehicles';
import { importRecords } from '$lib/data/multipart';
import { validateImportFile } from '$lib/utils/file-validation';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	return { vehicle };
};

export const actions = {
	import: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const file = formData.get('vehicle[import_file]') as File | null;

		if (!file || file.size === 0) {
			return fail(422, {
				errors: [{ id: 'form', title: 'Please select a CSV file to import' }]
			});
		}

		const validation = await validateImportFile(file, { maxSize: 10 * 1024 * 1024 });
		if (!validation.valid) {
			return fail(422, {
				errors: [{ id: 'form', title: validation.reason }]
			});
		}

		try {
			await importRecords(params.id!, formData, locals);
		} catch {
			return fail(422, {
				errors: [
					{
						id: 'form',
						title:
							'Import failed. Check that your CSV has the correct format and try again.'
					}
				]
			});
		}

		redirect(303, `/vehicles/${params.id}`);
	}
} satisfies Actions;
