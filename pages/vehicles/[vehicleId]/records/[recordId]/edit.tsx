import React from 'react';
import { Container, HStack } from '@chakra-ui/react';
import Page from 'components/common/Page';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import useRequest from 'hooks/useRequest';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import { VehicleRecord, vehicleRecordPath } from 'queries/records';
import RecordForm from 'components/forms/RecordForm';

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
            <Container maxW={[null, 'container.sm']} p={0}>
                {vehicle && (
                    <RecordForm vehicle={vehicle} record={vehicleRecord} />
                )}
            </Container>
        </Page>
    );
};

export default EditPage;

export { getServerSideProps } from '../..';
