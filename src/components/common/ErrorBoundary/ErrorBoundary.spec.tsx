import React from 'react';

import { render, screen } from '@testing-library/react';

import ErrorBoundary from '.';

describe('ErrorBoundary', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<ErrorBoundary {...props} />)).not.toThrow();
    });
});
