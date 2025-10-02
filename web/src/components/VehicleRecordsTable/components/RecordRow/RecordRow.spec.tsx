import React from 'react';

import { render, screen } from '@testing-library/react';

import RecordRow from '.';

describe('RecordRow', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<RecordRow {...props} />)).not.toThrow();
    });
});
