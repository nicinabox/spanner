import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleShareSettings from '.';

describe('VehicleShareSettings', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<VehicleShareSettings {...props} />)).not.toThrow();
    });
});
