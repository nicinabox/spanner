import React from 'react';

import { Meta } from '@storybook/react';

import { BackButton, BackButtonProps } from './BackButton';
import Header from '../Header';

const Template: React.VFC<BackButtonProps> = (props) => <BackButton {...props} />;

export const Default = Template.bind({});
Default.args = {
    children: 'Back',
};

const WithHeaderTemplate: React.VFC<BackButtonProps> = (props) => (
    <Header
        LeftComponent={<BackButton {...props} />}
    />
);

export const WithHeader = WithHeaderTemplate.bind({});
WithHeader.args = Default.args;

export default {
    title: 'Components/BackButton',
    component: BackButton,
} as Meta;
