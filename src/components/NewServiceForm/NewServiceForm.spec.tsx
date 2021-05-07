import React from 'react';

import { render, screen } from '@testing-library/react';

import vehicleFixture from '__fixtures__/vehicle';
import NewServiceForm from '.';

describe('NewServiceForm', () => {
    it('renders', () => {
        const props = {
            vehicle: {
                ...vehicleFixture,
            },
        };
        expect(() => render(<NewServiceForm {...props} />)).not.toThrow();
    });
});
