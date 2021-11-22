import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleSortMenu from '.';

describe('VehicleSortMenu', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<VehicleSortMenu {...props} />)).not.toThrow();
    });
});
