import React from 'react';

import { render, screen } from '@testing-library/react';

import TabMenu from '.';

describe('TabMenu', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<TabMenu {...props} />)).not.toThrow();
    });
});
