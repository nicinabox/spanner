import React from 'react';

import { Meta } from '@storybook/react';

import { FormSection, FormSectionProps } from './FormSection';

const Template: React.VFC<FormSectionProps> = (props) => <FormSection {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/FormSection',
    component: FormSection,
} as Meta;
