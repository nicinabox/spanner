import { AddIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
    Container, Flex, Heading, LinkBox, LinkOverlay, StackDivider, Text, VStack,
} from '@chakra-ui/react';
import LinkButton from 'components/common/LinkButton';
import useInlineColorMode from 'hooks/useInlineColorMode';
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
    const cm = useInlineColorMode();

    return (
        <Container>
            <Flex mb={6} direction="row-reverse">
                {!vehicle?.retired && (
                    <LinkButton href={`/vehicles/${vehicleId}/add#panel=1`} size="sm" leftIcon={<AddIcon />}>
                        Add
                    </LinkButton>
                )}
            </Flex>

            {vehicle?.reminders.map(((reminder) => {
                return (
                    <LinkBox
                        key={reminder.id}
                        py={3}
                        px={4}
                        mb={3}
                        borderRadius={6}
                        shadow="sm"
                        bg={cm('white', 'whiteAlpha.200')}
                        _hover={{ bg: cm('blackAlpha.50', 'whiteAlpha.300') }}
                    >
                        <Flex align="center">
                            <Flex flex={2} direction="column">
                                <Link href={`/vehicle/${vehicleId}/reminders/${reminder.id}`} passHref>
                                    <LinkOverlay>
                                        <Text>
                                            {reminder.notes}
                                        </Text>
                                    </LinkOverlay>
                                </Link>

                                {reminder.mileage && (
                                    <Text fontSize="sm" color={cm('blackAlpha.600', 'whiteAlpha.600')}>
                                        {formatMileage(reminder.mileage, vehicle.distanceUnit)}
                                    </Text>
                                )}
                            </Flex>
                            <Text color={isReminderOverdue(reminder) ? cm('red.500', 'red.600') : 'whiteAlpha'} ml={3}>
                                {reminder.reminderDate ? intlFormatDateUTC(reminder.reminderDate) : null}
                            </Text>

                            <ChevronRightIcon w={5} h={5} ml={2} color={cm('blackAlpha.600', 'whiteAlpha.600')} />
                        </Flex>
                    </LinkBox>
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
