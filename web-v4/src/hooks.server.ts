import { getAuthToken } from '$lib/session';
import { redirect, type Handle } from '@sveltejs/kit';

const protectedRoutes = ['^/vehicles'];

const isProtected = (url: string) => {
	const { pathname } = new URL(url);
	return protectedRoutes.some((pattern) => {
		return new RegExp(pattern, 'i').test(pathname);
	});
};

export const handle: Handle = async ({ event, resolve }) => {
	const authToken = await getAuthToken(event.cookies);

	if (!authToken && isProtected(event.request.url)) {
		throw redirect(307, '/');
	}

	event.locals.authToken = authToken;
	return resolve(event);
};
