import React from 'react';
import Link from 'next/link';
import {
    Text, Container, Flex, HStack, Heading, Skeleton, Button, Box, Spacer, useDisclosure,
} from '@chakra-ui/react';
import Page from 'components/common/Page';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import { reminderAPIPath } from 'queries/reminders';
import useRequest from 'hooks/useRequest';
import { vehicleAPIPath } from 'queries/vehicles';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import ReminderSummary from 'components/ReminderSummary';
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons';
import RecordForm from 'components/forms/RecordForm';
import useMutation from 'hooks/useMutation';
import * as reminders from 'queries/reminders';
import LinkButton from 'components/common/LinkButton';
import { editReminderPath } from 'utils/resources';

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

export const ReminderPage: React.FC<ReminderPageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<API.Vehicle>(vehicleAPIPath(params.vehicleId));
    const { data: reminder } = useRequest<API.Reminder>(reminderAPIPath(params.vehicleId, params.reminderId));

    const { isOpen, onToggle } = useDisclosure();

    const { mutate: destroyReminder } = useMutation(reminders.destroyReminder);

    return (
        <Page
            Header={<PageHeader vehicle={vehicle} />}
        >
            <Container maxW={[null, 'container.md']} p={0}>
                <HStack my={4} justify="end">
                    <Spacer />
                    <LinkButton href={editReminderPath(params.vehicleId, params.reminderId)} size="sm" colorScheme="brand">
                        Edit
                    </LinkButton>
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
                                mileage: reminder?.mileage,
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
