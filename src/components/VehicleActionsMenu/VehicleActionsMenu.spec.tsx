import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleActionsMenu from '.';

describe('VehicleActionsMenu', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<VehicleActionsMenu {...props} />)).not.toThrow();
    });
});
