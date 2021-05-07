import React from 'react';

import { render, screen } from '@testing-library/react';

import { Tabs } from '@chakra-ui/react';
import TabMenu from '.';

describe('TabMenu', () => {
    it('renders', () => {
        const props = {
            children: 'test',
        };
        expect(() => render(
            <Tabs>
                <TabMenu {...props} />
            </Tabs>,
        )).not.toThrow();
    });
});
