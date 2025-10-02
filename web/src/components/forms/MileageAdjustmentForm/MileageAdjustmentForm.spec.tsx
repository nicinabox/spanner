import React from 'react';

import { render, screen } from '@testing-library/react';

import vehicleFixture from '__fixtures__/vehicle';
import MileageAdjustmentForm from '.';

describe('MileageAdjustmentForm', () => {
    it('renders', () => {
        const props = {
            vehicle: {
                ...vehicleFixture,
            },
        };
        expect(() =>
            render(<MileageAdjustmentForm {...props} />),
        ).not.toThrow();
    });
});
