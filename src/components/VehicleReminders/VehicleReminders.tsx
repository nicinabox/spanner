import { AddIcon } from '@chakra-ui/icons';
import {
    Button, Container, Flex, Text,
} from '@chakra-ui/react';
import useRequest from 'hooks/useRequest';
import Link from 'next/link';
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
            <Flex mb={6}>
                <Link href={`/vehicles/${vehicleId}/add`} passHref>
                    <Button as="a" colorScheme="brand" size="sm" leftIcon={<AddIcon />}>
                        Add
                    </Button>
                </Link>
            </Flex>

            {vehicle?.reminders.map(((reminder) => {
                return (
                    <Flex py={2} borderBottomWidth={1} borderBottomColor="gray.100" minH={14}>
                        <Flex flex={2} direction="column">
                            <Text>
                                {reminder.notes}
                            </Text>

                            {reminder.reminderType === 'mileage' && (
                                <Text fontSize="sm">
                                    {formatMileage(reminder.mileage, vehicle.distanceUnit)}
                                </Text>
                            )}
                            {reminder.reminderType === 'date' && reminder.date && (
                                <Text fontSize="sm">
                                    {intlFormatDateISO(reminder.date)}
                                </Text>
                            )}
                            {reminder.reminderType === 'date_or_mileage' && reminder.date && (
                                <Text fontSize="sm">
                                    {reminder.date ? intlFormatDateISO(reminder.date) : null}
                                    {reminder.date && reminder.mileage && (
                                    <>
                                        {' '}
                                        or
                                        {' '}
                                    </>
                                )}
                                    {reminder.mileage ? formatMileage(reminder.mileage, vehicle.distanceUnit) : null}
                                </Text>
                            )}
                        </Flex>
                        <Text color={isReminderOverdue(reminder) ? 'red' : 'black'}>
                            {reminder.date ? intlFormatDateISO(reminder.date) : null}
                        </Text>
                    </Flex>
                );
            }))}
        </Container>
    );
};

export default VehicleReminders;
