import React from 'react';

import { render, screen } from '@testing-library/react';

import vehicleFixture from '__fixtures__/vehicle';
import VehicleActionsMenu from '.';

describe('VehicleActionsMenu', () => {
    it('renders', () => {
        const props = {
            vehicle: {
                ...vehicleFixture,
            },
        };
        expect(() => render(<VehicleActionsMenu {...props} />)).not.toThrow();
    });
});
