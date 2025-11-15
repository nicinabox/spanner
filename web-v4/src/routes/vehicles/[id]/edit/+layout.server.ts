import path from 'path';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	return {
		appBar: {
			backAction: {
				href: path.dirname(url.pathname),
				text: 'Back'
			}
		}
	};
};
