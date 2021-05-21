import { AddIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
    Container, Flex, Heading, LinkBox, LinkOverlay, Text,
} from '@chakra-ui/react';
import LinkButton from 'components/common/LinkButton';
import ReminderSummary from 'components/ReminderSummary';
import useInlineColorMode from 'hooks/useInlineColorMode';
import { mutate } from 'hooks/useMutation';
import useRequest from 'hooks/useRequest';
import Link from 'next/link';
import { VehicleReminder, vehicleReminderPath } from 'queries/reminders';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { getTime } from 'utils/date';

export interface VehicleRemindersProps {
    vehicleId: string
}

const sortDueSoonest = (a: VehicleReminder, b: VehicleReminder) => {
    if (!b.reminderDate) return -1;
    return getTime(a.reminderDate) - getTime(b.reminderDate);
};

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

            {vehicle?.reminders.sort(sortDueSoonest).map(((reminder) => {
                return (
                    <LinkBox
                        key={reminder.id}
                        py={3}
                        px={4}
                        mb={3}
                        borderRadius={6}
                        shadow="base"
                        bg={cm('white', 'whiteAlpha.200')}
                        transition="shadow"
                        _hover={{ bg: cm('gray.100', 'whiteAlpha.300') }}
                    >
                        <Flex align="center">
                            <Flex flex={2} direction="column">
                                <Link href={`/vehicles/${vehicleId}/reminders/${reminder.id}`} passHref>
                                    <LinkOverlay onClick={() => {
                                        mutate(vehicleReminderPath(vehicleId, reminder.id), reminder, false);
                                    }}
                                    >
                                        <Text>
                                            {reminder.notes}
                                        </Text>
                                    </LinkOverlay>
                                </Link>

                                <ReminderSummary
                                    reminder={reminder}
                                    distanceUnit={vehicle.distanceUnit}
                                    fontSize="sm"
                                />
                            </Flex>

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
