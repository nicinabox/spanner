import React from 'react';

import { Meta } from '@storybook/react';

import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';

const Template: React.VFC<ErrorBoundaryProps> = (props) => <ErrorBoundary {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/ErrorBoundary',
    component: ErrorBoundary,
} as Meta;
