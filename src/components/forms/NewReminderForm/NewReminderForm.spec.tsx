import React from 'react';

import { render, screen } from '@testing-library/react';

import vehicleFixture from '__fixtures__/vehicle';
import NewReminderForm from '.';

describe('NewReminderForm', () => {
    it('renders', () => {
        const props = {
            vehicle: {
                ...vehicleFixture,
            },
        };
        expect(() => render(<NewReminderForm {...props} />)).not.toThrow();
    });
});
