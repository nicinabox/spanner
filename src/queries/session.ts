import axios from 'axios';

const { PROXY_HOST } = process.env;

const serverApi = axios.create({
    baseURL: PROXY_HOST
})

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

export function signIn(token: string) {
    return serverApi.get<Session>(`/login/${token}`);
}

export function requestSession(email: string) {
    return axios.post(`/api/sessions`, { email });
}

export function destroySession(session: Session) {
    return serverApi.delete(`/sessions/${session.id}`);
}
