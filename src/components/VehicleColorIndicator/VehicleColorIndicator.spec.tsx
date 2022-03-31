import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleColorIndicator from '.';

describe('VehicleColorIndicator', () => {
    it('renders', () => {
        const props = {
            color: undefined,
        };
        expect(() => render(<VehicleColorIndicator {...props} />)).not.toThrow();
    });
});
