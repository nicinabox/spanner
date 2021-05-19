import React from 'react';

import { Meta } from '@storybook/react';

import { MarkdownBody, MarkdownBodyProps } from './MarkdownBody';

const Template: React.VFC<MarkdownBodyProps> = (props) => <MarkdownBody {...props} />;

export const Default = Template.bind({});
Default.args = {
    body: '# Hello world',
};

export default {
    title: 'Components/MarkdownBody',
    component: MarkdownBody,
} as Meta;
