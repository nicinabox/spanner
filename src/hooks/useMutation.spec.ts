import { renderHook } from '@testing-library/react-hooks';
import useMutation from './useMutation';

describe('useMutation', () => {
    it('returns', () => {
        const { result } = renderHook(() => useMutation());
        expect(result).not.toThrow();
    });
});
