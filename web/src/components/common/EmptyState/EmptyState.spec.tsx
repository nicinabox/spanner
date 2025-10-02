import React from 'react';

import { render, screen } from '@testing-library/react';

import EmptyState from '.';

describe('EmptyState', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<EmptyState {...props} />)).not.toThrow();
    });
});
