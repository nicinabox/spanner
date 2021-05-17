import { AddIcon } from '@chakra-ui/icons';
import {
    Button, Container, Flex, Heading, Text,
} from '@chakra-ui/react';
import useRequest from 'hooks/useRequest';
import Link from 'next/link';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { intlFormatDateUTC } from 'utils/date';
import { isReminderOverdue } from 'utils/reminders';
import { formatMileage } from 'utils/vehicle';

export interface VehicleRemindersProps {
    vehicleId: string
}

export const VehicleReminders: React.FC<VehicleRemindersProps> = ({ vehicleId }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(vehicleId));

    return (
        <Container>
            <Flex mb={6} direction="row-reverse">
                <Link href={`/vehicles/${vehicleId}/add#panel=1`} passHref>
                    <Button as="a" colorScheme="brand" size="sm" leftIcon={<AddIcon />}>
                        Add
                    </Button>
                </Link>
            </Flex>

            {vehicle?.reminders.map(((reminder) => {
                return (
                    <Flex key={reminder.id} py={2} borderBottomWidth={1} borderBottomColor="gray.100" minH={14}>
                        <Flex flex={2} direction="column">
                            <Text>
                                {reminder.notes}
                            </Text>

                            {reminder.mileage && (
                                <Text fontSize="sm">
                                    {formatMileage(reminder.mileage, vehicle.distanceUnit)}
                                </Text>
                            )}
                        </Flex>
                        <Text color={isReminderOverdue(reminder) ? 'red.500' : 'black'}>
                            {reminder.reminderDate ? intlFormatDateUTC(reminder.reminderDate) : null}
                        </Text>
                    </Flex>
                );
            }))}

            {Boolean(!vehicle?.reminders.length) && (
                <>
                    <Heading>
                        No reminders yet
                    </Heading>
                    <Text>
                        Use reminders to get notified of things on a date or mileage
                    </Text>
                </>
            )}
        </Container>
    );
};

export default VehicleReminders;
