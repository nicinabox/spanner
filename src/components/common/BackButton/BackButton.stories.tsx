import React from 'react';

import { Meta } from '@storybook/react';

import { BackButton, BackButtonProps } from './BackButton';

const Template: React.VFC<BackButtonProps> = (props) => <BackButton {...props} />;

export const Default = Template.bind({});
Default.args = {
    children: 'Back',
};

export default {
    title: 'Components/BackButton',
    component: BackButton,
} as Meta;
