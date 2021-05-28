import React from 'react';

import { Meta } from '@storybook/react';

import { NotesForm, NotesFormProps } from './NotesForm';

const Template: React.VFC<NotesFormProps> = (props) => <NotesForm {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/NotesForm',
    component: NotesForm,
} as Meta;
