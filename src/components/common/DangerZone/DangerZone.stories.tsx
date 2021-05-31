import React from 'react';

import { Meta } from '@storybook/react';

import { DangerZone, DangerZoneProps } from './DangerZone';

const Template: React.VFC<DangerZoneProps> = (props) => <DangerZone {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/DangerZone',
    component: DangerZone,
} as Meta;
