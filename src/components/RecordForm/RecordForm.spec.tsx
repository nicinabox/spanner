import React from 'react';

import { render, screen } from '@testing-library/react';

import vehicleFixture from '__fixtures__/vehicle';
import RecordForm from '.';

describe('RecordForm', () => {
    it('renders', () => {
        const props = {
            vehicle: {
                ...vehicleFixture,
            },
        };
        expect(() => render(<RecordForm {...props} />)).not.toThrow();
    });
});
