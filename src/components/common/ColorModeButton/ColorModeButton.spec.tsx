import React from 'react';

import { render, screen } from '@testing-library/react';

import ColorModeButton from '.';

describe('ColorModeButton', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<ColorModeButton {...props} />)).not.toThrow();
    });
});
