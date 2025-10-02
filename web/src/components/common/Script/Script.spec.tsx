import React from 'react';

import { render, screen } from '@testing-library/react';

import Script from '.';

describe('Script', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<Script {...props} />)).not.toThrow();
    });
});
