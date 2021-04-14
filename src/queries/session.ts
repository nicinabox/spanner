import axios from 'axios';

export interface Session {
    id: string;
}

export function signIn(token: string) {
    return axios.get<Session>(`/api/login/${token}`);
}
  
export function requestSession(email: string) {
    return axios.post('/api/sessions', { email });
}

export function destroySession(session: Session) {
    return axios.delete(`/api/sessions/${session.id}`);
}
