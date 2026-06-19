import React from 'react';

import { render } from '@testing-library/react';

import HeadInjections from '.';

describe('HeadInjections', () => {
    afterEach(() => {
        delete process.env.HEAD_INJECTIONS;
    });

    it('renders nothing when HEAD_INJECTIONS is unset', () => {
        delete process.env.HEAD_INJECTIONS;
        const { container } = render(<HeadInjections />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing when HEAD_INJECTIONS is empty', () => {
        process.env.HEAD_INJECTIONS = '';
        const { container } = render(<HeadInjections />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders injected HTML when HEAD_INJECTIONS is set', () => {
        process.env.HEAD_INJECTIONS =
            '<script defer src="https://example.com/script.js"></script>';
        render(<HeadInjections />);
        expect(
            document.querySelector('script[src="https://example.com/script.js"]')
        ).not.toBeNull();
    });
});