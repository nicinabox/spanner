import React from 'react';

import { Meta } from '@storybook/react';

import { ErrorBoundary } from './ErrorBoundary';

const Template: React.VFC = (props) => <ErrorBoundary {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/ErrorBoundary',
    component: ErrorBoundary,
} as Meta;
