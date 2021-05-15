import React from 'react';
import { Container, HStack } from '@chakra-ui/react';
import Page from 'components/Page';
import Header from 'components/Header';
import BackButton from 'components/BackButton';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import useRequest from 'hooks/useRequest';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import { VehicleRecord, vehicleRecordPath } from 'queries/records';

export interface EditPageProps {
    params: {
        vehicleId: string;
        recordId: string;
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

export const EditPage: React.FC<EditPageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(params.vehicleId));
    const { data: vehicleRecord } = useRequest<VehicleRecord>(vehicleRecordPath(params.vehicleId, params.recordId));

    return (
        <Page
            Header={<PageHeader vehicle={vehicle} />}
        >
            <Container>
                {vehicleRecord?.notes}
            </Container>
        </Page>
    );
};

export default EditPage;

export { getServerSideProps } from '../..';
