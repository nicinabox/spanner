import React from 'react';

import { Meta } from '@storybook/react';

import { LinkButton, LinkButtonProps } from './LinkButton';

const Template: React.VFC<LinkButtonProps> = (props) => <LinkButton {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/LinkButton',
    component: LinkButton,
} as Meta;
