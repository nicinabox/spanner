import { Container, HStack, TabPanel, TabPanels } from '@chakra-ui/react';
import BackButton from 'components/common/BackButton';
import LinkPreload from 'components/common/LinkPreload';
import MileageAdjustmentForm from 'components/forms/MileageAdjustmentForm';
import ReminderForm from 'components/forms/ReminderForm';
import Page from 'components/common/Page';
import RecordForm from 'components/forms/RecordForm';
import TabsHeader from 'components/common/TabsHeader';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import useRequest from 'hooks/useRequest';
import { recordsAPIPath } from 'queries/records';
import { vehicleAPIPath } from 'queries/vehicles';
import React from 'react';
import { sortRecordsNewestFirst } from 'utils/vehicle';
import lang from 'utils/lang';
import qs from 'qs';
import { VehiclePageProps } from '../[vehicleId]';

export type AddPageProps = VehiclePageProps;

const isServer = typeof window === 'undefined';

const PageHeader: React.FC<{ vehicle?: API.Vehicle }> = ({ vehicle }) => (
    <TabsHeader
        tabs={[
            'New Service',
            'New Reminder',
            `Adjust ${lang.mileageLabel[vehicle?.distanceUnit ?? 'mi']}`,
        ]}
        LeftComponent={
            <HStack spacing={2}>
                <BackButton>Back</BackButton>
                <VehicleActionsMenu vehicle={vehicle} />
            </HStack>
        }
    />
);

export const AddPage: React.FC<AddPageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<API.Vehicle>(
        vehicleAPIPath(params.vehicleId),
    );
    const { data: records } = useRequest<API.Record[]>(
        recordsAPIPath(params.vehicleId),
    );

    const newestRecordMileage: number =
        (records ? sortRecordsNewestFirst(records)[0]?.mileage : 0) ?? 0;
    const recordFormValues = isServer
        ? {}
        : qs.parse(window?.location.search.replace('?', ''));

    return (
        <Page Header={<PageHeader vehicle={vehicle} />}>
            <LinkPreload path={vehicleAPIPath(params.vehicleId)} />

            {vehicle && (
                <TabPanels>
                    <TabPanel p={0}>
                        <Container maxW={[null, 'container.md']} p={0}>
                            <RecordForm
                                vehicle={vehicle}
                                record={recordFormValues}
                            />
                        </Container>
                    </TabPanel>
                    <TabPanel p={0}>
                        <Container maxW={[null, 'md']} p={0}>
                            <ReminderForm
                                vehicleId={params.vehicleId}
                                distanceUnit={vehicle.distanceUnit}
                                minMileage={newestRecordMileage}
                            />
                        </Container>
                    </TabPanel>
                    <TabPanel p={0}>
                        <Container maxW={[null, 'md']} p={0}>
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
