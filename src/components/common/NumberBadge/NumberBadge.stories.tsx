import React from 'react';

import { Meta } from '@storybook/react';

import { NumberBadge } from './NumberBadge';

const Template: React.VFC = (props) => <NumberBadge {...props} />;

export const Default = Template.bind({});
Default.args = {
    children: '3',
    sentiment: 'neutral',
};

export default {
    title: 'Components/NumberBadge',
    component: NumberBadge,
} as Meta;
