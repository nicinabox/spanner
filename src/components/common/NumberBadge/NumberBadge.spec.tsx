import React from 'react';

import { render, screen } from '@testing-library/react';

import NumberBadge from '.';

describe('NumberBadge', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<NumberBadge {...props} />)).not.toThrow();
    });
});
