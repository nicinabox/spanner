import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleService from '.';

describe('VehicleService', () => {
    it('renders', () => {
        const props = {
            vehicleId: '123',
        };
        expect(() => render(<VehicleService {...props} />)).not.toThrow();
    });
});
