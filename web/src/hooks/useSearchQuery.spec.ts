import { renderHook } from '@testing-library/react-hooks';
import useSearchQuery from './useSearchQuery';

describe('useSearchQuery', () => {
    it('returns', () => {
        const { result } = renderHook(() => useSearchQuery());
        expect(result).not.toThrow();
    });
});
