import { AddIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
    Container, Flex, Heading, LinkBox, LinkOverlay, Text,
} from '@chakra-ui/react';
import EmptyState from 'components/common/EmptyState';
import LinkButton from 'components/common/LinkButton';
import ReminderSummary from 'components/ReminderSummary';
import useInlineColorMode from 'hooks/useInlineColorMode';
import { mutate } from 'hooks/useMutation';
import useRequest from 'hooks/useRequest';
import Link from 'next/link';
import { VehicleReminder, reminderAPIPath } from 'queries/reminders';
import { Vehicle, vehicleAPIPath } from 'queries/vehicles';
import React from 'react';
import { getTime } from 'utils/date';
import { reminderPath, vehicleAddPath } from 'utils/resources';

export interface VehicleRemindersProps {
    vehicleId: string
}

const sortByDueSoonest = (reminders: VehicleReminder[]) => {
    return [...reminders].sort((a, b) => {
        if (a.reminderDate && b.reminderDate) {
            return getTime(a.reminderDate) - getTime(b.reminderDate);
        }
        return 1;
    });
};

export const VehicleReminders: React.FC<VehicleRemindersProps> = ({ vehicleId }) => {
    const { data: vehicle, loading } = useRequest<Vehicle>(vehicleAPIPath(vehicleId));
    const cm = useInlineColorMode();

    const reminders = sortByDueSoonest(vehicle?.reminders ?? []);

    const isEmpty = !loading && !reminders.length;

    if (isEmpty) {
        return (
            <EmptyState
                heading="Get reminders in your inbox"
                details="Use reminders to get notified on a date or mileage."
                action={(
                    <LinkButton href={`${vehicleAddPath(vehicleId)}#panel=1`} leftIcon={<AddIcon />} shadow="lg">
                        New Reminder
                    </LinkButton>
                )}
            />
        );
    }

    return (
        <Container>
            <Flex mb={6} direction="row-reverse">
                {!vehicle?.retired && (
                    <LinkButton href={`${vehicleAddPath(vehicleId)}#panel=1`} size="sm" leftIcon={<AddIcon />}>
                        Add
                    </LinkButton>
                )}
            </Flex>

            {reminders.map(((reminder) => {
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
                                <Link href={reminderPath(vehicleId, reminder.id)} passHref>
                                    <LinkOverlay onClick={() => {
                                        mutate(reminderAPIPath(vehicleId, reminder.id), reminder, false);
                                    }}
                                    >
                                        <Text>
                                            {reminder.notes}
                                        </Text>
                                    </LinkOverlay>
                                </Link>

                                <ReminderSummary
                                    reminder={reminder}
                                    distanceUnit={vehicle?.distanceUnit}
                                    fontSize="sm"
                                />
                            </Flex>

                            <ChevronRightIcon w={5} h={5} ml={2} color={cm('blackAlpha.600', 'whiteAlpha.600')} />
                        </Flex>
                    </LinkBox>
                );
            }))}
        </Container>
    );
};

export default VehicleReminders;
