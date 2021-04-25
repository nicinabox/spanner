import { HStack, Button, Container, Tab, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
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

export interface EditVehiclePageProps extends VehiclePageProps {
}

export const EditVehiclePage: React.FC<EditVehiclePageProps> = ({ params, ...props }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(params.vehicleId), { initialData: props.data.vehicle })

    return (
        <Page
            p={0}
            Header={() => (
                <Header
                    mb={0}
                    LeftComponent={
                        <HStack spacing={2}>
                            <Link href={`/vehicles/${vehicle.id}`} passHref>
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
            )}
        >
           <Container>
               <VehicleForm vehicle={vehicle} />
           </Container>
        </Page>
    );
};

export default EditVehiclePage;

export { getServerSideProps } from '../[vehicleId]';
