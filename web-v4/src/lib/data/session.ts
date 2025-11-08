import { createAPIRequest } from './client';

export interface Session {
	id: string;
	userId: string;
	email: string;
	description: string;
	ip: string;
	lastSeen: string;
	userAgent: string;
	authToken: string;
}

const request = createAPIRequest();

export const create = async (body: { email: string }) => {
	return request(`/sessions`, { method: 'POST', body: JSON.stringify(body) });
};

export async function signin(token: string) {
	return request<Session>(`/login/${token}`);
}
