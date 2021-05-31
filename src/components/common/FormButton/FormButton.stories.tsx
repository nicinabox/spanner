import React from 'react';

import { Meta } from '@storybook/react';

import { FormButton, FormButtonProps } from './FormButton';

const Template: React.VFC<FormButtonProps> = (props) => <FormButton {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/FormButton',
    component: FormButton,
} as Meta;
