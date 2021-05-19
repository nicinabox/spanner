import React from 'react';

import { Meta } from '@storybook/react';

import { DatePicker } from './DatePicker';

const Template: React.VFC = (props) => <DatePicker {...props} />;
export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/DatePicker',
    component: DatePicker,
} as Meta;
