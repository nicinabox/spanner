import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleForm from '.';

describe('VehicleForm', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<VehicleForm {...props} />)).not.toThrow();
    });
});
