import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleItem from '.';

describe('VehicleItem', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<VehicleItem {...props} />)).not.toThrow();
    });
});
