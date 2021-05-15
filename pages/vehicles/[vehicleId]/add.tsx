import {
    Container, HStack, TabPanel, TabPanels,
} from '@chakra-ui/react';
import BackButton from 'components/BackButton';
import LinkPreload from 'components/LinkPreload';
import MileageAdjustmentForm from 'components/MileageAdjustmentForm';
import NewReminderForm from 'components/NewReminderForm';
import Page from 'components/Page';
import RecordForm from 'components/RecordForm';
import TabsHeader from 'components/TabsHeader';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import useRequest from 'hooks/useRequest';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
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
                <BackButton>
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
                            <RecordForm vehicle={vehicle} />
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
