import React from 'react';

import { render, screen } from '@testing-library/react';

import NewReminderForm from '.';

describe('NewReminderForm', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<NewReminderForm {...props} />)).not.toThrow();
    });
});
