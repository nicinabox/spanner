import { getVehicle } from '$lib/data/vehicles';
import { importRecords } from '$lib/data/multipart';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	return { vehicle };
};

export const actions = {
	import: async ({ request, locals, params }) => {
		const formData = await request.formData();

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
