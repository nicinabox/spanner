import React from 'react';

import { render, screen } from '@testing-library/react';

import vehicleFixture from '__fixtures__/vehicle';
import ReminderForm from '.';

describe('ReminderForm', () => {
    it('renders', () => {
        const props = {
            vehicle: {
                ...vehicleFixture,
            },
        };
        expect(() => render(<ReminderForm {...props} />)).not.toThrow();
    });
});
