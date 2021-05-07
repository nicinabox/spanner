import React from 'react';

import { render, screen } from '@testing-library/react';

import vehicleFixture from '__fixtures__/vehicle';
import VehicleItem from '.';

describe('VehicleItem', () => {
    it('renders', () => {
        const props = {
            vehicle: {
                ...vehicleFixture,
            },
        };
        expect(() => render(<VehicleItem {...props} />)).not.toThrow();
    });
});
