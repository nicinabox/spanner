import { createAPIRequest } from './client';

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

const request = createAPIRequest();

export const create = async (data: { email: string; host?: string }) => {
	return request(`/sessions`, { method: 'POST', json: data });
};

export async function signin(token: string) {
	return request<Session>(`/login/${token}`);
}
