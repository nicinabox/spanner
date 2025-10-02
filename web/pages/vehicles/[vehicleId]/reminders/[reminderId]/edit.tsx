import React from 'react';
import Link from 'next/link';
import { Container, Heading, HStack } from '@chakra-ui/react';
import Page from 'components/common/Page';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import useRequest from 'hooks/useRequest';
import { vehicleAPIPath } from 'queries/vehicles';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import ReminderForm from 'components/forms/ReminderForm';
import { getNewestRecordMileage } from 'utils/reminders';
import { recordsAPIPath } from 'queries/records';
import { reminderAPIPath } from 'queries/reminders';

export interface EditReminderPageProps {
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

export const EditReminderPage: React.FC<EditReminderPageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<API.Vehicle>(vehicleAPIPath(params.vehicleId));
    const { data: reminder } = useRequest<API.Reminder>(reminderAPIPath(params.vehicleId, params.reminderId));

    return (
        <Page
            Header={<PageHeader vehicle={vehicle} />}
        >
            <Container maxW={[null, 'md']} p={0}>
                <Heading mb={6}>
                    Edit Reminder
                </Heading>
                <ReminderForm
                    vehicleId={params.vehicleId}
                    distanceUnit={vehicle?.distanceUnit}
                    formValues={reminder}
                />
            </Container>
        </Page>
    );
};

export default EditReminderPage;

export { getServerSideProps } from '../../../[vehicleId]';
