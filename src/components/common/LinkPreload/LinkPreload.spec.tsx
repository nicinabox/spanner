import React from 'react';

import { render, screen } from '@testing-library/react';

import LinkPreload from '.';

describe('LinkPreload', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<LinkPreload {...props} />)).not.toThrow();
    });
});
