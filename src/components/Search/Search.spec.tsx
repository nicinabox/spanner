import React from 'react';

import { render, screen } from '@testing-library/react';

import Search from '.';

describe('Search', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<Search {...props} />)).not.toThrow();
    });
});
