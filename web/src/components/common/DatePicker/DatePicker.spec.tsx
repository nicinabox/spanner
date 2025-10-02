import React from 'react';

import { render, screen } from '@testing-library/react';

import DatePicker from '.';

describe('DatePicker', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<DatePicker {...props} />)).not.toThrow();
    });
});
