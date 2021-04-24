import { AxiosInstance } from 'axios';
import { clientAPI } from 'queries/config';
import { useState } from 'react';
import useSWR from 'swr';
export * from 'swr';

const fetcher = async (...args: any[]) => {
    const [url] = args;
    const { data } = await clientAPI.get(url);
    return data;
}

export default function useRequest<Data = any>(queryKey: string, options = {}) {
    return useSWR<Data>(queryKey, fetcher, options);
}

interface MutationCallbacks<T> {
    onError?: (error: string) => void;
    onSuccess?: (data: T) => void;
}

export function useMutation<T>(queryFn: (api: AxiosInstance, ...args: any[]) => Promise<T>, { onError, onSuccess }: MutationCallbacks<T> = {}) {
    const [status, setStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
    const [data, setData] = useState<T | undefined>();
    const [error, setError] = useState<string | undefined>();

    const mutate = async (...args: any[]) => {
        setStatus('processing');

        try {
            const nextData = await queryFn(clientAPI, ...args)
            setData(nextData);
            onSuccess?.(nextData);
        } catch (err) {
            setError(err.response?.data?.error ?? err.toString());
            onError?.(err);
        } finally {
            setStatus('complete');
        }
    };

    return {
        mutate,
        data,
        error,
        status,
        isIdle: status === 'processing',
        isProcessing: status === 'processing',
        isComplete: status === 'complete',
    }
}
