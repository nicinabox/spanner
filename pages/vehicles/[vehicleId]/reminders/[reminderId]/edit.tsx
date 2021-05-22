import React from 'react';
import Link from 'next/link';
import { Container, Heading, HStack } from '@chakra-ui/react';
import Page from 'components/common/Page';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import useRequest from 'hooks/useRequest';
import { Vehicle, vehicleAPIPath } from 'queries/vehicles';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import ReminderForm from 'components/forms/ReminderForm';
import { getNewestRecordMileage } from 'utils/reminders';
import { recordsAPIPath, VehicleRecord } from 'queries/records';
import { reminderAPIPath, VehicleReminder } from 'queries/reminders';

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
    const { data: vehicle } = useRequest<Vehicle>(vehicleAPIPath(params.vehicleId));
    // const { data: records } = useRequest<VehicleRecord[]>(recordsAPIPath(params.vehicleId));
    const { data: reminder } = useRequest<VehicleReminder>(reminderAPIPath(params.vehicleId, params.reminderId));

    // const newestRecordMileage = getNewestRecordMileage(records);

    return (
        <Page
            Header={<PageHeader vehicle={vehicle} />}
        >
            <Container maxW={[null, 'sm']} p={0}>
                <Heading mb={6}>
                    Edit Reminder
                </Heading>
                <ReminderForm
                    vehicleId={params.vehicleId}
                    distanceUnit={vehicle?.distanceUnit}
                    minMileage={undefined}
                    formValues={reminder}
                />
            </Container>
        </Page>
    );
};

export default EditReminderPage;

export { getServerSideProps } from '../../../[vehicleId]';
