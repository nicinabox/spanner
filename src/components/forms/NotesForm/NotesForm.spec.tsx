import React from 'react';

import { render, screen } from '@testing-library/react';

import NotesForm from '.';

describe('NotesForm', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<NotesForm {...props} />)).not.toThrow();
    });
});
