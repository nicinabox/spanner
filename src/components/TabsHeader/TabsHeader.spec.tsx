import React from 'react';

import { render, screen } from '@testing-library/react';

import TabsHeader from '.';

describe('TabsHeader', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<TabsHeader {...props} />)).not.toThrow();
    });
});
