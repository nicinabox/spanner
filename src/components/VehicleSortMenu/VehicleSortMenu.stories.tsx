import React from 'react';

import { Meta } from '@storybook/react';

import { VehicleSortMenu, VehicleSortMenuProps } from './VehicleSortMenu';

const Template: React.VFC<VehicleSortMenuProps> = (props) => <VehicleSortMenu {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/VehicleSortMenu',
    component: VehicleSortMenu,
} as Meta;
