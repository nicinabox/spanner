import { getSession } from '$lib/utils/session';
import { redirect, type Handle } from '@sveltejs/kit';

const protectedRoutes = ['^/vehicles'];

const isProtected = (url: string) => {
	const { pathname } = new URL(url);
	return protectedRoutes.some((pattern) => {
		return new RegExp(pattern, 'i').test(pathname);
	});
};

export const handle: Handle = async ({ event, resolve }) => {
	const session = await getSession(event.cookies);

	if (!session?.authToken && isProtected(event.request.url)) {
		throw redirect(307, '/');
	}

	event.locals.session = session;
	event.locals.authToken = session?.authToken;

	const theme = event.cookies.get('theme');

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			if (theme && theme !== 'auto') {
				return html.replace('<html', `<html data-theme="${theme}"`);
			}
			return html;
		}
	});
};
