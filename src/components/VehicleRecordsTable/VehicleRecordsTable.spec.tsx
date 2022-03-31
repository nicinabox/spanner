import React from 'react';

import { getByText, render, screen } from '@testing-library/react';

import VehicleRecordsTable from '.';

describe('VehicleRecordsTable', () => {
    it('renders', () => {
        const props = {
            enableCost: true,
            distanceUnit: 'mi',
            records: [],
        };
        expect(() => render(<VehicleRecordsTable {...props} />)).not.toThrow();
    });

    it('renders formatted ISO date', () => {
        const props = {
            enableCost: true,
            distanceUnit: 'mi',
            records: [
                {
                    date: '2021-05-01T00:00:00.000Z',
                    notes: 'Test',
                    cost: null,
                    mileage: 10,
                    id: 1,
                },
            ],
        };
        render(<VehicleRecordsTable {...props} />);
        expect(screen.getByText('May 1, 2021')).toBeInTheDocument();
    });
});
