import React from 'react';

import { render, screen } from '@testing-library/react';

import DestroyButton from '.';

describe('DestroyButton', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<DestroyButton {...props} />)).not.toThrow();
    });
});
