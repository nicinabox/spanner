import React from 'react';

import { render, screen } from '@testing-library/react';

import SubmitButton from '.';

describe('SubmitButton', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<SubmitButton {...props} />)).not.toThrow();
    });
});
