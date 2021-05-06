import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleSummary from '.';

describe('VehicleSummary', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<VehicleSummary {...props} />)).not.toThrow();
    });
});
