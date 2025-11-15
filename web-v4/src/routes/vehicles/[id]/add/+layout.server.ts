import path from 'path';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, url }) => {
	const vehiclePath = `/vehicles/${params.id}`;

	return {
		appBar: {
			backAction: {
				href: path.dirname(url.pathname),
				text: 'Back'
			},
			tabs: [
				{ href: `${vehiclePath}/add?view=new-service`, text: 'New Service' },
				{ href: `${vehiclePath}/add?view=new-reminder`, text: 'New Reminder' },
				{ href: `${vehiclePath}/add?view=mileage-adjustment`, text: 'Mileage Adjustment' }
			]
		}
	};
};
