import {
    Container, HStack, TabPanel, TabPanels,
} from '@chakra-ui/react';
import BackButton from 'components/common/BackButton';
import LinkPreload from 'components/common/LinkPreload';
import MileageAdjustmentForm from 'components/forms/MileageAdjustmentForm';
import NewReminderForm from 'components/forms/NewReminderForm';
import Page from 'components/common/Page';
import RecordForm from 'components/forms/RecordForm';
import TabsHeader from 'components/common/TabsHeader';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import useRequest from 'hooks/useRequest';
import { VehicleRecord, vehicleRecordsPath } from 'queries/records';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { sortRecordsNewestFirst } from 'utils/vehicle';
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
    const { data: records } = useRequest<VehicleRecord[]>(vehicleRecordsPath(params.vehicleId));

    const newestRecordMileage = records ? sortRecordsNewestFirst(records)[0].mileage : 0;

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
                            <NewReminderForm vehicle={vehicle} minMileage={newestRecordMileage} />
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
