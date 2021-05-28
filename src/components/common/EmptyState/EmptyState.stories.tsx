import React from 'react';

import { Meta } from '@storybook/react';

import { EmptyState, EmptyStateProps } from './EmptyState';

const Template: React.VFC<EmptyStateProps> = (props) => <EmptyState {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/EmptyState',
    component: EmptyState,
} as Meta;
