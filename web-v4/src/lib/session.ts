import type { Cookies } from '@sveltejs/kit';
import { sealData, unsealData, type SessionOptions } from 'iron-session';
import { CLIENT_SECRET } from '$env/static/private';

export const sessionOptions: SessionOptions = {
	password: CLIENT_SECRET,
	cookieName: 'session',
	ttl: 5_184_000, // 60 days
	cookieOptions: {
		secure: false
	}
};

export const getSession = async (cookies: Cookies) => {
	const cookie = cookies.get(sessionOptions.cookieName);
	if (!cookie) return;
	const session = await unsealData<{ session: { authToken: string } }>(cookie, sessionOptions);
	return session?.session;
};

export const setSession = async (cookies: Cookies, session: { authToken: string }) => {
	const sealed = await sealData({ session }, sessionOptions);
	cookies.set(sessionOptions.cookieName, sealed, {
		path: '/',
		...sessionOptions.cookieOptions
	});
};

export const getAuthToken = async (cookies: Cookies) => {
	const session = await getSession(cookies);
	return session?.authToken;
};
