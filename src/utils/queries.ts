import { AxiosInstance } from 'axios';
import { createAPIRequest } from 'queries/config';

interface InitialData<T> {
    data?: T;
    error?: string;
}

export const fetchInitialData = async <T>(
    req, fetcher: (api: AxiosInstance) => Promise<T>,
): Promise<InitialData<T>> => {
    const api = createAPIRequest(req);

    try {
        const data = await fetcher(api);
        return { data };
    } catch (err) {
        const error = err.response?.data?.error ?? err.toString();
        return { error };
    }
};
