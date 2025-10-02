import { Text, TextProps } from '@chakra-ui/react';
import useInlineColorMode from 'hooks/useInlineColorMode';
import React from 'react';
import { intlFormatDateUTC } from 'utils/date';
import { isReminderOverdue } from 'utils/reminders';
import { formatMileage } from 'utils/vehicle';

export interface ReminderSummaryProps extends TextProps {
    reminder: API.Reminder | undefined;
    distanceUnit: API.DistanceUnit | undefined;
}

export const ReminderSummary: React.FC<ReminderSummaryProps> = ({
    reminder,
    distanceUnit = 'mi',
    ...textProps
}) => {
    const cm = useInlineColorMode();

    const date =
        reminder?.reminderDate && intlFormatDateUTC(reminder.reminderDate);
    const mileage = reminder && formatMileage(reminder.mileage, distanceUnit);

    if (!reminder?.reminderDate && !reminder?.mileage) {
        return (
            <Text color={cm('blackAlpha.700', 'whiteAlpha.600')}>
                No reminder set.
            </Text>
        );
    }

    return (
        <Text
            {...textProps}
            color={
                isReminderOverdue(reminder)
                    ? cm('red.500', 'red.300')
                    : cm('blackAlpha.700', 'whiteAlpha.600')
            }
        >
            Reminder scheduled for {date && <Text as="strong">{date}</Text>}
            {reminder.reminderType === 'date_or_mileage' &&
                reminder.reminderDate &&
                ' or '}
            {reminder.reminderType === 'mileage' && ' at '}
            {reminder.mileage && <Text as="strong">{mileage}</Text>}
        </Text>
    );
};

export default ReminderSummary;
