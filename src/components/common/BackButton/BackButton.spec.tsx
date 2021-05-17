import React from 'react';

import { render, screen } from '@testing-library/react';

import BackButton from '.';

describe('BackButton', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<BackButton {...props} />)).not.toThrow();
    });
});
