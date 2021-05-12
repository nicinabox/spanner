import React from 'react';

import { render } from '@testing-library/react';

import vehicleFixture from '__fixtures__/vehicle';
import recordFixure from '__fixtures__/record';
import VehicleSummary from '.';

describe('VehicleSummary', () => {
    it('renders summary', () => {
        const props = {
            vehicle: {
                ...vehicleFixture,
                estimatedMileage: 3290,
                milesPerYear: 280,
            },
            records: [
                { ...recordFixure },
            ],
        };

        const { container } = render(<VehicleSummary {...props} />);
        expect(container.firstChild).toHaveTextContent('Since July 18, 2019, you drive about 280 mi per year for an estimated 3,290 mi.');
    });

    it('does not render summary when no estimated mileage', () => {
        const props = {
            vehicle: {
                ...vehicleFixture,
                estimatedMileage: 0,
                milesPerYear: 280,
            },
            records: [
                { ...recordFixure },
            ],
        };

        const { container } = render(<VehicleSummary {...props} />);
        expect(container.firstChild).toBeNull();
    });
});
