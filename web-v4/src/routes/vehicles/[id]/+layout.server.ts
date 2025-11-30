import { getVehicleHistory } from '$lib/data/history';
import { getVehicle } from '$lib/data/vehicles';
import path from 'path';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, params, url }) => {
	const [vehicle, history] = await Promise.all([
		getVehicle(params.id, locals),
		getVehicleHistory(params.id, locals)
	]);

	return {
		vehicle,
		history,
		appBar: {
			backAction: {
				href: path.dirname(url.pathname),
				text: 'Vehicles'
			},
			tabs: [
				{ href: `/vehicles/${params.id}?view=history`, text: 'History' },
				{ href: `/vehicles/${params.id}?view=reminders`, text: 'Reminders' },
				{ href: `/vehicles/${params.id}?view=notes`, text: 'Notes' }
			]
		}
	};
};
