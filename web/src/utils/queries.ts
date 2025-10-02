import { AxiosInstance } from 'axios';
import { createAPIRequest } from 'queries/config';

export const fetcher = (path: string, options?) => async (req) => {
    const api = createAPIRequest(req);
    const { data } = await api.get(path, options);
    return data;
};

export const prefetch = async <T>(
    req,
    pathOrHandler: string | ((api: AxiosInstance) => Promise<T>),
    options?,
): Promise<{ data?: T; error?: any }> => {
    let result;

    if (typeof pathOrHandler === 'string') {
        const path = pathOrHandler;
        result = fetcher(path, options)(req);
    } else {
        const api = createAPIRequest(req);
        const handler = pathOrHandler;
        result = handler(api);
    }

    try {
        const data = await result;
        return { data };
    } catch (err) {
        const error = err.response?.data?.error ?? err.toString();
        return { error };
    }
};
