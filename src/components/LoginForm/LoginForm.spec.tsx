import React from 'react';

import { render, screen } from '@testing-library/react';

import LoginForm from '.';

describe('LoginForm', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<LoginForm {...props} />)).not.toThrow();
    });
});
