import React from 'react';

import { render, screen } from '@testing-library/react';

import FormSection from '.';

describe('FormSection', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<FormSection {...props} />)).not.toThrow();
    });
});
