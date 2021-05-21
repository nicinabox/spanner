import { Text, TextProps } from '@chakra-ui/react';
import useInlineColorMode from 'hooks/useInlineColorMode';
import { VehicleReminder } from 'queries/reminders';
import React from 'react';
import { intlFormatDateUTC } from 'utils/date';
import { isReminderOverdue } from 'utils/reminders';
import { formatMileage } from 'utils/vehicle';

export interface ReminderSummaryProps extends TextProps {
    reminder: VehicleReminder | undefined;
    distanceUnit: string;
}

export const ReminderSummary: React.FC<ReminderSummaryProps> = ({ reminder, distanceUnit = 'mi', ...textProps }) => {
    const cm = useInlineColorMode();

    const date = reminder?.reminderDate && intlFormatDateUTC(reminder.reminderDate);
    const mileage = reminder && formatMileage(reminder.mileage, distanceUnit);

    if (!reminder?.reminderDate && !reminder?.mileage) return null;

    return (
        <Text {...textProps} color={isReminderOverdue(reminder) ? cm('red.500', 'red.300') : cm('blackAlpha.700', 'whiteAlpha.600')}>
            {date && (
                <Text as="span">{date}</Text>
            )}

            {reminder.reminderType === 'date_or_mileage' && ' or '}
            {reminder.reminderType === 'mileage' && ' at '}

            {reminder.mileage && (
                <Text as="span">{mileage}</Text>
            )}
        </Text>
    );
};

export default ReminderSummary;
