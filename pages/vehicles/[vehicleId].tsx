import { HStack, TabPanel, TabPanels } from '@chakra-ui/react';
import BackButton from 'components/BackButton';
import LinkPreload from 'components/LinkPreload';
import Page from 'components/Page';
import TabsHeader from 'components/TabsHeader';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import VehicleNotes from 'components/VehicleNotes';
import VehicleReminders from 'components/VehicleReminders';
import VehicleService from 'components/VehicleService';
import useRequest from 'hooks/useRequest';
import { vehicleRecordsPath } from 'queries/records';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { isReminderOverdue } from 'utils/reminders';
import { authRedirect, withSession } from 'utils/session';

export interface VehiclePageProps {
    params: {
        vehicleId: string;
    }
}

const PageHeader = ({ vehicle, overDueReminders }) => (
    <TabsHeader
        tabs={
            [
                'Service',
                { text: 'Reminders', badge: overDueReminders.length, badgeSentiment: 'negative' },
                'Notes',
            ]
        }
        LeftComponent={(
            <HStack spacing={2}>
                <BackButton href="/vehicles">
                    Vehicles
                </BackButton>

                <VehicleActionsMenu vehicle={vehicle} />
            </HStack>
            )}
    />
);

const VehiclePage: React.FC<VehiclePageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(params.vehicleId));

    return (
        <Page
            p={0}
            Header={<PageHeader vehicle={vehicle} overDueReminders={vehicle?.reminders.filter(isReminderOverdue) ?? []} />}
        >
            <LinkPreload path={[
                vehiclePath(params.vehicleId),
                vehicleRecordsPath(params.vehicleId),
            ]}
            />

            <TabPanels>
                <TabPanel px={0}>
                    <VehicleService vehicleId={params.vehicleId} />
                </TabPanel>
                <TabPanel px={0}>
                    <VehicleReminders vehicleId={params.vehicleId} />
                </TabPanel>
                <TabPanel px={0}>
                    {vehicle && (
                        <VehicleNotes vehicle={vehicle} />
                    )}
                </TabPanel>
            </TabPanels>
        </Page>
    );
};

export const getServerSideProps = withSession(async ({ req, params }) => {
    const redirect = authRedirect(req);
    if (redirect) return redirect;

    return {
        props: {
            params,
        },
    };
});

export default VehiclePage;
