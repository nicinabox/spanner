import React from 'react';

import { render, screen } from '@testing-library/react';

import Header from '.';

describe('Header', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<Header {...props} />)).not.toThrow();
    });
});
