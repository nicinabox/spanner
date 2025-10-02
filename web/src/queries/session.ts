import { AxiosInstance } from 'axios';

export type ClientSession = Omit<API.Session, 'authToken'>;

export async function signIn(api: AxiosInstance, token: string) {
    const { data } = await api.get<API.Session>(`/login/${token}`);
    return data;
}

export async function fetchUser(api: AxiosInstance) {
    const { data } = await api.get<API.User>('/user');
    return data;
}

export async function requestSession(api: AxiosInstance, email: string) {
    const { data } = await api.post('/api/sessions', {
        email,
        host: window.location.origin,
    });
    return data;
}
