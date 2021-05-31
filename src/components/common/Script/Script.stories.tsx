import React from 'react';

import { Meta } from '@storybook/react';

import { Script, ScriptProps } from './Script';

const Template: React.VFC<ScriptProps> = (props) => <Script {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/Script',
    component: Script,
} as Meta;
