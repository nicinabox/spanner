import { HStack, Button, Container, Tab, TabPanel, TabPanels, Tabs, Heading } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Header from 'components/Header';
import Page from 'components/Page';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import React from 'react';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import { VehiclePageProps } from '../[vehicleId]';
import useRequest from 'hooks/useRequest';
import VehicleForm from 'components/VehicleForm';
import LinkPreload from 'components/LinkPreload';

export interface EditVehiclePageProps extends VehiclePageProps {
}

export const EditVehiclePage: React.FC<EditVehiclePageProps> = ({ params, ...props }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(params.vehicleId))

    return (
        <Page
            Header={
                <Header
                    LeftComponent={
                        <HStack spacing={2}>
                            <Link href={`/vehicles/${vehicle?.id}`} passHref>
                                <Button
                                    as="a"
                                    leftIcon={<ArrowBackIcon />}
                                    size="sm"
                                    variant="solid"
                                    colorScheme="gray"
                                >
                                    Back
                                </Button>
                            </Link>
                            <VehicleActionsMenu vehicle={vehicle} />
                        </HStack>
                    }
                />
            }
        >
            <LinkPreload path={vehiclePath(params.vehicleId)} />

            <Container>
                <Heading mb={6}>Edit {vehicle?.name}</Heading>
                <VehicleForm vehicle={vehicle} />
            </Container>
        </Page>
    );
};

export default EditVehiclePage;

export { getServerSideProps } from '../[vehicleId]';
