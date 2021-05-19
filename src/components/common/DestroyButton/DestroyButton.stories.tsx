import React from 'react';

import { Meta } from '@storybook/react';

import { DestroyButton, DestroyButtonProps } from './DestroyButton';

const Template: React.VFC<DestroyButtonProps> = (props) => <DestroyButton {...props} />;

export const Default = Template.bind({});
Default.args = {
    children: 'Delete',
};

export default {
    title: 'Components/DestroyButton',
    component: DestroyButton,
} as Meta;
