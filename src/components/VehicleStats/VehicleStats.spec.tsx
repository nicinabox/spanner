import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleStats from '.';

describe('VehicleStats', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<VehicleStats {...props} />)).not.toThrow();
    });
});
