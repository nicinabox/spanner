import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleRecordsTable from '.';

describe('VehicleRecordsTable', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<VehicleRecordsTable {...props} />)).not.toThrow();
    });
});
