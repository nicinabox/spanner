---
to: src/hooks/<%= name %>.spec.ts
---
import { renderHook } from '@testing-library/react-hooks';
import <%= name %> from './<%= name %>';

describe('<%= name %>', () => {
    it('returns', () => {
        const { result } = renderHook(() => <%= name %>());
        expect(result).not.toThrow();
    });
});
