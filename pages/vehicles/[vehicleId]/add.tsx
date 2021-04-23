import { HStack, Button, Container, Tab, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Header from 'components/Header';
import Page from 'components/Page';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import React from 'react';
import { Vehicle } from 'queries/vehicles';
import TabMenu from 'components/TabMenu';
import NewServiceForm from 'components/NewServiceForm';
import MileageAdjustmentForm from 'components/MileageAdjustmentForm';
import NewReminderForm from 'components/NewReminderForm';

export interface AddPageProps {
    vehicle: Vehicle;
}

export const AddPage: React.FC<AddPageProps> = ({ vehicle }) => {
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
            <Tabs colorScheme="brand" mt={0}>
                <TabMenu>
                    <Tab>Add Service</Tab>
                    <Tab>Add Reminder</Tab>
                    <Tab>Adjust Mileage</Tab>
                </TabMenu>

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
            </Tabs>
        </Page>
    );
};

export default AddPage;

export { getServerSideProps } from '../[vehicleId]';
