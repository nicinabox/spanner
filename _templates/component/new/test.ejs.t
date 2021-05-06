---
to: src/components/<%= name %>/<%= name %>.spec.tsx
---
import React from 'react';

import { render, screen } from '@testing-library/react';

import <%= name %> from '.';

describe('<%= name %>', () => {
    it('renders', () => {
        const props = {};
        expect(() => render(<<%= name %> {...props} />)).not.toThrow();
    });
});
