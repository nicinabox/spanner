import React from 'react';

import { render, screen } from '@testing-library/react';

import UserMenu from '.';

describe('UserMenu', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<UserMenu {...props} />)).not.toThrow();
    });
});
