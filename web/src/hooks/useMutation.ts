import { useState } from 'react';
import { AxiosInstance } from 'axios';
import { APIError } from 'components/common/FormErrors';
import { clientAPI } from 'queries/config';

export * from 'swr';

export interface MutationCallbacks<T> {
    onError?: (error: string) => void;
    onSuccess?: (data: T) => void;
}

export type MutationFn<T> = (api: AxiosInstance, ...args: any[]) => Promise<T>;

interface APIReponseError {
    errors: APIError[];
}

export default function useMutation<T>(mutationFn: MutationFn<T>, { onError, onSuccess }: MutationCallbacks<T> = {}) {
    const [status, setStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
    const [data, setData] = useState<T | undefined>();
    const [error, setError] = useState<Error | APIReponseError | undefined>();

    const reset = () => {
        setData(undefined);
        setError(undefined);
        setStatus('idle');
    };

    const mutate = async (...args: any[]) => {
        setStatus('processing');
        setError(undefined);

        try {
            const nextData = await mutationFn(clientAPI, ...args);
            setData(nextData);
            onSuccess?.(nextData);
        } catch (err) {
            const queryError = err.response?.data ?? err;
            setError(queryError);
            onError?.(queryError);
        } finally {
            setStatus('complete');
        }
    };

    return {
        mutate,
        reset,
        data,
        error,
        status,
        isIdle: status === 'idle',
        isProcessing: status === 'processing',
        isComplete: status === 'complete',
    };
}
