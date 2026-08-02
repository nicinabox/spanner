import type { Handle } from '@sveltejs/kit';

export const createThemeTransform =
	(): Handle =>
	async ({ event, resolve }) => {
		const prefsCookie = event.cookies.get('prefs');
		const theme = Object.fromEntries(new URLSearchParams(prefsCookie ?? '')).theme;

		return resolve(event, {
			transformPageChunk: ({ html }) => {
				if (theme && theme !== 'auto') {
					return html.replace('<html', `<html data-theme="${theme}"`);
				}
				return html;
			},
		});
	};
