import React from 'react';

import { render, screen } from '@testing-library/react';

import VehiclesList from '.';

describe('VehiclesList', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<VehiclesList {...props} />)).not.toThrow();
    });
});
