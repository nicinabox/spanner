import React from 'react';
import Link from 'next/link';
import {
    Text, Container, Flex, HStack, Heading, Skeleton, Button, Box, Spacer, useDisclosure,
} from '@chakra-ui/react';
import Page from 'components/common/Page';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import { VehicleReminder, reminderAPIPath } from 'queries/reminders';
import useRequest from 'hooks/useRequest';
import { Vehicle, vehicleAPIPath } from 'queries/vehicles';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import ReminderSummary from 'components/ReminderSummary';
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons';
import RecordForm from 'components/forms/RecordForm';
import useMutation from 'hooks/useMutation';
import * as reminders from 'queries/reminders';

export interface ReminderPageProps {
    params: {
        vehicleId: string;
        reminderId: string;
    }
}

const PageHeader = ({ vehicle }) => {
    return (
        <Header
            LeftComponent={(
                <HStack spacing={2}>
                    <BackButton>
                        Reminders
                    </BackButton>
                    <VehicleActionsMenu vehicle={vehicle} />
                </HStack>
            )}
        />
    );
};

export const ReminderPage: React.FC<ReminderPageProps> = ({ params, ...props }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehicleAPIPath(params.vehicleId));
    const { data: reminder } = useRequest<VehicleReminder>(reminderAPIPath(params.vehicleId, params.reminderId));

    const { isOpen, onToggle } = useDisclosure();

    const { mutate: destroyReminder } = useMutation(reminders.destroyReminder);

    return (
        <Page
            Header={<PageHeader vehicle={vehicle} />}
        >
            <Container maxW="container.md">
                <HStack my={4} justify="end">
                    <Spacer />
                    <Button size="sm" colorScheme="brand">Edit</Button>
                </HStack>

                <Box mb={10}>
                    <Skeleton isLoaded={Boolean(reminder)} minH={6} mb={2}>
                        <Heading size="lg">
                            {reminder?.notes}
                        </Heading>
                    </Skeleton>

                    <Skeleton isLoaded={Boolean(reminder)} minH={4}>
                        <ReminderSummary reminder={reminder} distanceUnit={vehicle?.distanceUnit} />
                    </Skeleton>
                </Box>

                <Button
                    onClick={onToggle}
                    rightIcon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    colorScheme="brand"
                >
                    Convert to service
                </Button>

                {isOpen && vehicle && (
                    <Box mt={4}>
                        <RecordForm
                            vehicle={vehicle}
                            record={{
                                notes: reminder?.notes,
                            }}
                            onSuccess={() => {
                                return destroyReminder(params.vehicleId, params.reminderId);
                            }}
                        />
                    </Box>
                )}
            </Container>
        </Page>
    );
};

export default ReminderPage;

export { getServerSideProps } from '../../[vehicleId]';
