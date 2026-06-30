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

export const create = async (data: { email: string; host?: string }) => {
	return request(`/sessions`, { method: 'POST', json: data });
};

export async function signin(token: string) {
	return request<Session>(`/login/${token}`);
}

export const login = async (data: { email: string; password?: string; host?: string }) => {
	return request<{ auth_token?: string }>('/login', { method: 'POST', json: data });
};

export const requestReset = async (data: { email: string }) => {
	return request('/password/reset', { method: 'POST', json: data });
};

export const resetPassword = async (token: string, data: { password: string }) => {
	return request<Session>(`/password/reset/${token}`, { method: 'POST', json: data });
};

export const setPassword = async (
	data: { password: string; currentPassword?: string },
	opts: RequestOpts,
) => {
	return request('/password', { ...opts, method: 'PUT', json: data });
};
