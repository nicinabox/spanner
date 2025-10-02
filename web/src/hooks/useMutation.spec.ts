import { renderHook, act } from '@testing-library/react-hooks';
import useMutation from './useMutation';

describe('useMutation', () => {
    it('returns initial hook state', () => {
        const queryFn = jest.fn();
        const { result } = renderHook(() => useMutation(queryFn));

        expect(result.current).toEqual({
            data: undefined,
            error: undefined,
            status: 'idle',
            isIdle: true,
            isProcessing: false,
            isComplete: false,
            mutate: expect.any(Function),
        });
    });

    it('returns loading state', () => {
        const queryFn = jest.fn();
        const { result } = renderHook(() => useMutation(queryFn));

        act(() => result.current.mutate());

        expect(result.current).toEqual({
            data: undefined,
            error: undefined,
            status: 'processing',
            isIdle: false,
            isProcessing: true,
            isComplete: false,
            mutate: expect.any(Function),
        });
    });

    it('returns data', async () => {
        const queryFn = jest.fn().mockResolvedValue({ test: true });
        const { result } = renderHook(() => useMutation(queryFn));

        await act(() => result.current.mutate());

        expect(result.current).toEqual({
            data: {
                test: true,
            },
            error: undefined,
            status: 'complete',
            isIdle: false,
            isProcessing: false,
            isComplete: true,
            mutate: expect.any(Function),
        });
    });

    it('returns error', async () => {
        const queryFn = jest.fn().mockRejectedValue('test error');
        const { result } = renderHook(() => useMutation(queryFn));

        await act(() => result.current.mutate());

        expect(result.current).toEqual({
            data: undefined,
            error: 'test error',
            status: 'complete',
            isIdle: false,
            isProcessing: false,
            isComplete: true,
            mutate: expect.any(Function),
        });
    });

    it('calls success callback with data', async () => {
        const queryFn = jest.fn().mockResolvedValue({ test: true });
        const onSuccess = jest.fn();

        const { result } = renderHook(() =>
            useMutation(queryFn, {
                onSuccess,
            }),
        );

        await act(() => result.current.mutate());

        expect(onSuccess).toHaveBeenCalledWith({ test: true });
    });

    it('calls error callback with errror', async () => {
        const queryFn = jest.fn().mockRejectedValue('test error');
        const onError = jest.fn();

        const { result } = renderHook(() =>
            useMutation(queryFn, {
                onError,
            }),
        );

        await act(() => result.current.mutate());

        expect(onError).toHaveBeenCalledWith('test error');
    });
});
