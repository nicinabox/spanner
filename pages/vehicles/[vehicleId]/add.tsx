import {
    HStack, Button, Container, Tab, TabPanel, TabPanels, Tabs, Spacer,
} from '@chakra-ui/react';
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
import useRequest from 'hooks/useRequest';
import LinkPreload from 'components/LinkPreload';
import TabsHeader from 'components/TabsHeader';
import BackButton from 'components/BackButton';
import { VehiclePageProps } from '../[vehicleId]';

export type AddPageProps = VehiclePageProps

const PageHeader: React.FC<{ vehicle?: Vehicle }> = ({ vehicle }) => (
    <TabsHeader
        tabs={[
                'Add Service',
                'Add Reminder',
                'Adjust Mileage',
            ]}
        LeftComponent={(
            <HStack spacing={2}>
                <BackButton href={`/vehicles/${vehicle?.id}`}>
                    Back
                </BackButton>
                <VehicleActionsMenu vehicle={vehicle} />
            </HStack>
              )}
    />
);

export const AddPage: React.FC<AddPageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(params.vehicleId));

    return (
        <Page
            Header={<PageHeader vehicle={vehicle} />}
        >
            <LinkPreload path={vehiclePath(params.vehicleId)} />

            {vehicle && (
                <TabPanels>
                    <TabPanel p={0}>
                        <Container maxW={[null, 'container.sm']} p={0}>
                            <NewServiceForm vehicle={vehicle} />
                        </Container>
                    </TabPanel>
                    <TabPanel p={0}>
                        <Container maxW={[null, 'sm']} p={0}>
                            <NewReminderForm vehicle={vehicle} />
                        </Container>
                    </TabPanel>
                    <TabPanel p={0}>
                        <Container maxW={[null, 'sm']} p={0}>
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
