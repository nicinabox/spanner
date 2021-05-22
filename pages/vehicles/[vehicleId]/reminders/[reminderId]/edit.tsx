import React from 'react';
import Link from 'next/link';
import { Container, HStack } from '@chakra-ui/react';
import Page from 'components/common/Page';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import useRequest from 'hooks/useRequest';
import { Vehicle, vehicleAPIPath } from 'queries/vehicles';
import VehicleActionsMenu from 'components/VehicleActionsMenu';

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

    return (
        <Page
            Header={<PageHeader vehicle={vehicle} />}
        >
            <Container>
                TODO
            </Container>
        </Page>
    );
};

export default EditReminderPage;

export { getServerSideProps } from '../../../[vehicleId]';
