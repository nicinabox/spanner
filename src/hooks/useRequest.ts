import { clientAPI } from 'queries/config';
import useSWR from 'swr';

export const get = async (url: string) => {
    const { data } = await clientAPI.get(url);
    return data;
};

export const update = async (url: string, body) => {
    const { data } = await clientAPI.put(url, body);
    return data;
};

export default function useRequest<Data = any>(queryKey: string, options = {}) {
    const result = useSWR<Data>(queryKey, get, options);
    return {
        ...result,
        loading: !result.data && !result.error,
    };
}
