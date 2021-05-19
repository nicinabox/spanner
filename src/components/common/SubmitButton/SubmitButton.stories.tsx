import React from 'react';

import { Meta } from '@storybook/react';

import { SubmitButton, SubmitButtonProps } from './SubmitButton';

const Template: React.VFC<SubmitButtonProps> = (props) => <SubmitButton {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/SubmitButton',
    component: SubmitButton,
} as Meta;
