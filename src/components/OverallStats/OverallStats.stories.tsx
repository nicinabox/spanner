import React from 'react';

import { Meta } from '@storybook/react';

import { OverallStats, OverallStatsProps } from './OverallStats';

const Template: React.VFC<OverallStatsProps> = (props) => <OverallStats {...props} />;

export const Default = Template.bind({});
Default.args = {

};

export default {
    title: 'Components/OverallStats',
    component: OverallStats,
} as Meta;
