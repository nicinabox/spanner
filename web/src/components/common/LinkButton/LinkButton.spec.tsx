import React from 'react';

import { render, screen } from '@testing-library/react';

import LinkButton from '.';

describe('LinkButton', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<LinkButton {...props} />)).not.toThrow();
    });
});
