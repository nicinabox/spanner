import type { Cookies } from '@sveltejs/kit';
import { sealData, unsealData, type SessionOptions } from 'iron-session';
import { CLIENT_SECRET, USE_SECURE_COOKIE } from '$app/env/private';
import type { Session } from '$lib/data/session';

export const sessionOptions: SessionOptions = {
	password: CLIENT_SECRET,
	cookieName: 'session',
	ttl: 7_776_000, // 90 days
	cookieOptions: {
		secure: USE_SECURE_COOKIE,
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 7_776_000 - 60, // expire cookie 60s before seal
	},
};

export const getSession = async (cookies: Cookies) => {
	const cookie = cookies.get(sessionOptions.cookieName);
	if (!cookie) return;
	try {
		const session = await unsealData<{ session: Session }>(cookie, sessionOptions);
		return session?.session;
	} catch {
		return undefined;
	}
};

export const setSession = async (cookies: Cookies, session: Session) => {
	const sealed = await sealData({ session }, sessionOptions);
	cookies.set(sessionOptions.cookieName, sealed, {
		path: '/',
		...sessionOptions.cookieOptions,
	});
};

export const clearSession = (cookies: Cookies) => {
	cookies.delete(sessionOptions.cookieName, {
		path: '/',
		...sessionOptions.cookieOptions,
	});
};

export const getAuthToken = async (cookies: Cookies) => {
	const session = await getSession(cookies);
	return session?.authToken;
};
