import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleReminders from '.';

describe('VehicleReminders', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<VehicleReminders {...props} />)).not.toThrow();
    });
});
