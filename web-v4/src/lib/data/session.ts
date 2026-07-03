import { request } from './server';
import type { RequestOpts } from './types';

export interface Session {
	id: number;
	userId: string;
	email: string;
	description: string;
	ip: string;
	lastSeen: string;
	userAgent: string;
	authToken: string;
}

export const create = async (data: { email: string }, opts?: RequestOpts) => {
	return request(`/sessions`, { ...opts, method: 'POST', json: data });
};

export async function signin(token: string) {
	return request<Session>(`/login/${token}`);
}

export const login = async (
	data: {
		email: string;
		password?: string;
		timeZoneOffset?: string;
	},
	opts?: RequestOpts
) => {
	const { timeZoneOffset, ...body } = data;
	return request<{ auth_token?: string }>('/login', {
		...opts,
		method: 'POST',
		json: body,
		headers: timeZoneOffset ? { 'Time-Zone-Offset': timeZoneOffset } : undefined,
	});
};

export const requestReset = async (data: { email: string }, opts?: RequestOpts) => {
	return request('/password/reset', { ...opts, method: 'POST', json: data });
};

export const resetPassword = async (token: string, data: { password: string }, opts?: RequestOpts) => {
	return request<Session>(`/password/reset/${token}`, { ...opts, method: 'POST', json: data });
};

export const setPassword = async (
	data: { password: string; currentPassword?: string },
	opts: RequestOpts,
) => {
	return request('/password', { ...opts, method: 'PUT', json: data });
};
