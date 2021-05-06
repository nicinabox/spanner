import React from 'react';

import { render, screen } from '@testing-library/react';

import Logo from '.';

describe('Logo', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<Logo {...props} />)).not.toThrow();
    });
});
