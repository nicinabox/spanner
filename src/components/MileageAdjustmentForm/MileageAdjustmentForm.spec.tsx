import React from 'react';

import { render, screen } from '@testing-library/react';

import MileageAdjustmentForm from '.';

describe('MileageAdjustmentForm', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<MileageAdjustmentForm {...props} />)).not.toThrow();
    });
});
