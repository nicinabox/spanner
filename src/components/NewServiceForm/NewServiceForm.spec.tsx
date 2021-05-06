import React from 'react';

import { render, screen } from '@testing-library/react';

import NewServiceForm from '.';

describe('NewServiceForm', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<NewServiceForm {...props} />)).not.toThrow();
    });
});
