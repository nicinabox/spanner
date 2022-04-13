import { AxiosInstance } from 'axios';
import { createAPIRequest } from 'queries/config';

export const prefetch = async <T>(req, handler: (api: AxiosInstance) => Promise<T>): Promise<[T | null, string | null]> => {
    try {
        const api = createAPIRequest(req);
        const data = await handler(api);
        return [data, null];
    } catch (err) {
        const error = err.response?.data?.error ?? err.toString();
        return [null, error];
    }
};
