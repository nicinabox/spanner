import React from 'react';

import { render, screen } from '@testing-library/react';

import MarkdownBody from '.';

describe('MarkdownBody', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<MarkdownBody {...props} />)).not.toThrow();
    });
});
