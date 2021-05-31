import React from 'react';

import { render, screen } from '@testing-library/react';

import OverallStats from '.';

describe('OverallStats', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<OverallStats {...props} />)).not.toThrow();
    });
});
