import React from 'react';

import { render, screen } from '@testing-library/react';

import vehicleFixture from '__fixtures__/vehicle';
import VehicleNotes from '.';

describe('VehicleNotes', () => {
    it('renders', () => {
        const props = {
            vehicle: {
                ...vehicleFixture,
            },
        };
        expect(() => render(<VehicleNotes {...props} />)).not.toThrow();
    });
});
