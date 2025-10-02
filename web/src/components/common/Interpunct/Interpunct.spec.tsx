import React from 'react';

import { render, screen } from '@testing-library/react';

import Interpunct from '.';

describe('Interpunct', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<Interpunct {...props} />)).not.toThrow();
    });
});
