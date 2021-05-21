import React from 'react';
import Link from 'next/link';
import {
    Text, Container, Flex, HStack, Heading, Skeleton, Button, Box,
} from '@chakra-ui/react';
import Page from 'components/common/Page';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import { VehicleReminder, vehicleReminderPath } from 'queries/reminders';
import useRequest from 'hooks/useRequest';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import { intlFormatDateUTC } from 'utils/date';
import { formatMileage } from 'utils/vehicle';
import useInlineColorMode from 'hooks/useInlineColorMode';
import ReminderSummary from 'components/ReminderSummary';

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
                        Back
                    </BackButton>
                    <VehicleActionsMenu vehicle={vehicle} />
                </HStack>
            )}
        />
    );
};

export const ReminderPage: React.FC<ReminderPageProps> = ({ params, ...props }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(params.vehicleId));
    const { data: reminder } = useRequest<VehicleReminder>(vehicleReminderPath(params.vehicleId, params.reminderId));

    return (
        <Page
            Header={<PageHeader vehicle={vehicle} />}
        >
            <Container>
                <Skeleton isLoaded={Boolean(reminder)}>
                    <Heading size="lg" mb={4}>
                        {reminder?.notes}
                    </Heading>
                </Skeleton>

                {reminder && vehicle ? (
                    <ReminderSummary reminder={reminder} distanceUnit={vehicle?.distanceUnit} />
                ) : (
                    <Skeleton h={3} />
                )}

                <Box mt={6}>
                    <Button>Convert to service</Button>
                </Box>
            </Container>
        </Page>
    );
};

export default ReminderPage;

export { getServerSideProps } from '../../[vehicleId]';
