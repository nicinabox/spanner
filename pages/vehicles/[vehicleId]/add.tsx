import { HStack, Button, Container, Tab, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Header from 'components/Header';
import Page from 'components/Page';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import React from 'react';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import TabMenu from 'components/TabMenu';
import NewServiceForm from 'components/NewServiceForm';
import MileageAdjustmentForm from 'components/MileageAdjustmentForm';
import NewReminderForm from 'components/NewReminderForm';
import { VehiclePageProps } from '../[vehicleId]';
import useRequest from 'hooks/useRequest';
import LinkPreload from 'components/LinkPreload';
import TabsHeader from 'components/TabsHeader';

export interface AddPageProps extends VehiclePageProps {
}

const PageHeader: React.FC<{ vehicle?: Vehicle }> = ({ vehicle }) => {
    return (
        <TabsHeader
            tabs={[
                'Add Service',
                'Add Reminder',
                'Adjust Mileage',
            ]}
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
    );
}

export const AddPage: React.FC<AddPageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(params.vehicleId))

    return (
        <Page
            Header={<PageHeader vehicle={vehicle} />}
        >
            <LinkPreload path={vehiclePath(params.vehicleId)} />

            {vehicle && (
                <TabPanels>
                    <TabPanel>
                        <Container maxW="container.md">
                            <NewServiceForm vehicle={vehicle} />
                        </Container>
                    </TabPanel>
                    <TabPanel>
                        <Container maxW="container.sm">
                            <NewReminderForm vehicle={vehicle} />
                        </Container>
                    </TabPanel>
                    <TabPanel>
                        <Container maxW="container.sm">
                            <MileageAdjustmentForm vehicle={vehicle} />
                        </Container>
                    </TabPanel>
                </TabPanels>
            )}
        </Page>
    );
};

export default AddPage;

export { getServerSideProps } from '../[vehicleId]';
