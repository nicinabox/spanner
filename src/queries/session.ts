import axios, { AxiosInstance } from 'axios';

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

export interface User {
    id: number;
    email: string;
}

export type ClientSession = Omit<Session, 'authToken'>

export function signIn(api: AxiosInstance, token: string) {
    return api.get<Session>(`/login/${token}`);
}

export async function fetchUser(api: AxiosInstance) {
    const { data } = await api.get<User>('/user');
    return data;
}

export function requestSession(email: string) {
    return axios.post('/api/sessions', { email });
}
