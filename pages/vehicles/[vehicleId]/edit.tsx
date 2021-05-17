import {
    HStack, Button, Container, Tab, TabPanel, TabPanels, Tabs, Heading,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Header from 'components/common/Header';
import Page from 'components/common/Page';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import React from 'react';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import useRequest from 'hooks/useRequest';
import VehicleForm from 'components/VehicleForm';
import LinkPreload from 'components/common/LinkPreload';
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
