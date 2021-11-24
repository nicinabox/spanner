import React from 'react';

import { Meta } from '@storybook/react';

import { VehicleShareSettings, VehicleShareSettingsProps } from './VehicleShareSettings';

const Template: React.VFC<VehicleShareSettingsProps> = (props) => <VehicleShareSettings {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/VehicleShareSettings',
    component: VehicleShareSettings,
} as Meta;
