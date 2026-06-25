import { getVehicle } from '$lib/data/vehicles';
import { getHistoryEntry, updateHistoryEntry, deleteHistoryEntry } from '$lib/data/history';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const record = await getHistoryEntry(params.id!, params.recordId!, locals);

	return { vehicle, record };
};

export const actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const notes = formData.get('notes')?.toString() ?? '';
		const date = formData.get('date')?.toString();
		const mileage = formData.get('mileage')?.toString();
		const cost = formData.get('cost')?.toString();

		if (!date) {
			return fail(400, { errors: [{ id: 'date', title: 'Date is required' }] });
		}
		if (!notes) {
			return fail(400, { errors: [{ id: 'notes', title: 'Notes is required' }] });
		}

		await updateHistoryEntry(
			params.id!,
			params.recordId!,
			{
				date,
				notes,
				mileage: mileage ? Number(mileage) : null,
				cost: cost || null
			} as never,
			locals
		);

		redirect(303, `/vehicles/${params.id}`);
	},

	delete: async ({ locals, params }) => {
		await deleteHistoryEntry(params.id!, params.recordId!, locals);
		redirect(303, `/vehicles/${params.id}`);
	}
} satisfies Actions;
