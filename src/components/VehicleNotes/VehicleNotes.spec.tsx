import React from 'react';

import { render, screen } from '@testing-library/react';

import VehicleNotes from '.';

describe('VehicleNotes', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<VehicleNotes {...props} />)).not.toThrow();
    });
});
