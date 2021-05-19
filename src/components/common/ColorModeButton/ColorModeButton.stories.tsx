import React from 'react';

import { Meta } from '@storybook/react';

import Header from 'components/common/Header';
import { ColorModeButton, ColorModeButtonProps } from './ColorModeButton';

const Template: React.VFC<ColorModeButtonProps> = (props) => <ColorModeButton {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export const WithHeader: React.VFC<ColorModeButtonProps> = (props) => (
    <Header
        py={2}
        RightComponent={<ColorModeButton {...props} />}
    />
);

export default {
    title: 'Components/ColorModeButton',
    component: ColorModeButton,
} as Meta;
