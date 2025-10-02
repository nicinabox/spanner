import React from 'react';

import { render, screen } from '@testing-library/react';

import ReminderSummary from '.';

describe('ReminderSummary', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<ReminderSummary {...props} />)).not.toThrow();
    });
});
