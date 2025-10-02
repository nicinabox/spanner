import React from 'react';

import { render, screen } from '@testing-library/react';

import FormErrors from '.';

describe('FormErrors', () => {
    it('renders', () => {
        const props = {
            errors: [],
        };
        expect(() => render(<FormErrors {...props} />)).not.toThrow();
    });
});
