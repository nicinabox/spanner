import { clientAPI } from 'queries/config';
import useSWR from 'swr';

const fetcher = async (...args: any[]) => {
    const [url] = args;
    const { data } = await clientAPI.get(url);
    return data;
};

export default function useRequest<Data = any>(queryKey: string, options = {}) {
    return useSWR<Data>(queryKey, fetcher, options);
}
