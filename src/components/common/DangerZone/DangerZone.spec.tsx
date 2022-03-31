import React from 'react';

import { render, screen } from '@testing-library/react';

import DangerZone from '.';

describe('DangerZone', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<DangerZone {...props} />)).not.toThrow();
    });
});
