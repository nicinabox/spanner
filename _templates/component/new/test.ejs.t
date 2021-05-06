---
to: src/components/<%= name %>/<%= name %>.spec.ts
---
import React from 'react';

import { render, screen } from '@testing-library/react';

import <%= name %>, { <%= name %>Props } from '..';

jest.mock('helpers/env');

describe('<%= name %>', () => {
    let props: <%= name %>Props;

    beforeEach(() => {
        props = {

        };
    });

    it('renders', () => {
        expect(() => render(<<%= name %> {...props} />)).not.toThrow();
    });
});
