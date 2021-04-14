import axios from 'axios';

const { PROXY_HOST } = process.env;

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
    return axios.get<Session>(`${PROXY_HOST}/login/${token}`);
}
  
export function requestSession(email: string) {
    return axios.post(`${PROXY_HOST}/sessions`, { email });
}

export function destroySession(session: Session) {
    return axios.delete(`${PROXY_HOST}/sessions/${session.id}`);
}
