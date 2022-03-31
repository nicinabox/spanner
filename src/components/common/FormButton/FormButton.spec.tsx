import React from 'react';

import { render, screen } from '@testing-library/react';

import FormButton from '.';

describe('FormButton', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<FormButton {...props} />)).not.toThrow();
    });
});
