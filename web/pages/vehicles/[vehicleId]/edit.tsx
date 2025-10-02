import { Container, Heading, HStack } from '@chakra-ui/react';
import BackButton from 'components/common/BackButton';
import Header from 'components/common/Header';
import LinkPreload from 'components/common/LinkPreload';
import Page from 'components/common/Page';
import VehicleForm from 'components/forms/VehicleForm';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import useRequest from 'hooks/useRequest';
import { vehicleAPIPath } from 'queries/vehicles';
import React from 'react';
import { VehiclePageProps } from '../[vehicleId]';

export type EditVehiclePageProps = VehiclePageProps;

export const EditVehiclePage: React.FC<EditVehiclePageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<API.Vehicle>(
        vehicleAPIPath(params.vehicleId),
    );

    return (
        <Page
            Header={
                <Header
                    LeftComponent={
                        <HStack spacing={2}>
                            <BackButton>Back</BackButton>
                            <VehicleActionsMenu vehicle={vehicle} />
                        </HStack>
                    }
                />
            }
        >
            <LinkPreload path={vehicleAPIPath(params.vehicleId)} />

            <Container maxW={[null, 'lg']} p={0}>
                <Heading mb={6}>Edit {vehicle?.name}</Heading>
                <VehicleForm vehicle={vehicle} />
            </Container>
        </Page>
    );
};

export default EditVehiclePage;

export { getServerSideProps } from '../[vehicleId]';
