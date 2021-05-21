import React from 'react';

import { Meta } from '@storybook/react';

import { mileageReminderFixture } from '__fixtures__/reminder';
import { ReminderSummary, ReminderSummaryProps } from './ReminderSummary';

const Template: React.VFC<ReminderSummaryProps> = (props) => <ReminderSummary {...props} />;

export const Default = Template.bind({});
Default.args = {
    reminder: mileageReminderFixture,
    distanceUnit: 'mi',
};

export default {
    title: 'Components/ReminderSummary',
    component: ReminderSummary,
} as Meta;
