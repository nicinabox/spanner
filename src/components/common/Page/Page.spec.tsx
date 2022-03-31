import React from 'react';

import { render, screen } from '@testing-library/react';

import Page from '.';

describe('Page', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<Page {...props} />)).not.toThrow();
    });
});
