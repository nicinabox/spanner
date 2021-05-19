---
to: src/components/<%= path %>/<%= name %>/<%= name %>.stories.tsx
---
import React from 'react';

import { Meta } from '@storybook/react';

import { <%= name %>, <%= name %>Props } from './<%= name %>';

const Template: React.VFC<<%= name %>Props> = (props) => <<%= name %> {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/<%= name %>',
    component: <%= name %>,
} as Meta;
