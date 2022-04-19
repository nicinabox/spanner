import React from 'react';

import { render, screen } from '@testing-library/react';

import RecordGroup from '.';

describe('RecordGroup', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<RecordGroup {...props} />)).not.toThrow();
    });
});
