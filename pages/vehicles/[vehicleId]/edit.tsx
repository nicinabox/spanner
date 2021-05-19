import { ArrowBackIcon } from '@chakra-ui/icons';
import { Container, Heading, HStack } from '@chakra-ui/react';
import Header from 'components/common/Header';
import LinkButton from 'components/common/LinkButton';
import LinkPreload from 'components/common/LinkPreload';
import Page from 'components/common/Page';
import VehicleForm from 'components/forms/VehicleForm';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import useRequest from 'hooks/useRequest';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { VehiclePageProps } from '../[vehicleId]';

export type EditVehiclePageProps = VehiclePageProps

export const EditVehiclePage: React.FC<EditVehiclePageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(params.vehicleId));

    return (
        <Page
            Header={(
                <Header
                    LeftComponent={(
                        <HStack spacing={2}>
                            <LinkButton
                                href={`/vehicles/${vehicle?.id}`}
                                leftIcon={<ArrowBackIcon />}
                                size="sm"
                                variant="solid"
                                colorScheme="gray"
                            >
                                Back
                            </LinkButton>
                            <VehicleActionsMenu vehicle={vehicle} />
                        </HStack>
                      )}
                />
              )}
        >
            <LinkPreload path={vehiclePath(params.vehicleId)} />

            <Container maxW={[null, 'md']} p={0}>
                <Heading mb={6}>
                    Edit
                    {' '}
                    {vehicle?.name}
                </Heading>
                <VehicleForm vehicle={vehicle} />
            </Container>
        </Page>
    );
};

export default EditVehiclePage;

export { getServerSideProps } from '../[vehicleId]';
