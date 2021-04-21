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

export type ClientSession = Omit<Session, 'authToken'>

export function signIn(api: AxiosInstance, token: string) {
    return api.get<Session>(`/login/${token}`);
}

export function requestSession(email: string) {
    return axios.post(`/api/sessions`, { email });
}
