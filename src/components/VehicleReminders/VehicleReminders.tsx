import {
    Text, Box, Container, Heading,
} from '@chakra-ui/react';
import useRequest from 'hooks/useRequest';
import { VehicleReminder } from 'queries/reminders';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { intlFormatDateISO } from 'utils/date';
import { isReminderOverdue } from 'utils/reminders';
import { formatMileage } from 'utils/vehicle';

export interface VehicleRemindersProps {
    vehicleId: string
}

export const VehicleReminders: React.FC<VehicleRemindersProps> = ({ vehicleId }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(vehicleId));

    return (
        <Container>
            <Heading>
                Reminders
            </Heading>

            {vehicle?.reminders.map(((reminder) => {
                return (
                    <Box mb={3}>
                        <Text>
                            {reminder.notes}
                        </Text>
                        <Text>
                            {reminder.date ? intlFormatDateISO(reminder.date) : null}
                        </Text>
                        <Text>
                            {reminder.mileage ? formatMileage(reminder.mileage, vehicle.distanceUnit) : null}
                        </Text>
                        <Text>
                            {isReminderOverdue(reminder) && 'Overdue'}
                        </Text>
                    </Box>
                );
            }))}
        </Container>
    );
};

export default VehicleReminders;
