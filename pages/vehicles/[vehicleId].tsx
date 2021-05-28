import { HStack, TabPanel, TabPanels } from '@chakra-ui/react';
import BackButton from 'components/common/BackButton';
import LinkPreload from 'components/common/LinkPreload';
import Page from 'components/common/Page';
import TabsHeader from 'components/common/TabsHeader';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import VehicleNotes from 'components/VehicleNotes';
import VehicleReminders from 'components/VehicleReminders';
import VehicleService from 'components/VehicleService';
import useRequest from 'hooks/useRequest';
import { recordsAPIPath } from 'queries/records';
import { Vehicle, vehicleAPIPath } from 'queries/vehicles';
import React from 'react';
import { getOverdueRemindersCount } from 'utils/reminders';
import { vehiclesPath } from 'utils/resources';
import { authRedirect, withSession } from 'utils/session';

export interface VehiclePageProps {
    params: {
        vehicleId: string;
    }
}

const PageHeader = ({ vehicle, overDueRemindersBadge }) => (
    <TabsHeader
        hashchange
        tabs={
            [
                'History',
                { text: 'Reminders', badge: overDueRemindersBadge, badgeSentiment: 'negative' },
                'Notes',
            ]
        }
        LeftComponent={(
            <HStack spacing={2}>
                <BackButton href={vehiclesPath()}>
                    Vehicles
                </BackButton>

                <VehicleActionsMenu vehicle={vehicle} />
            </HStack>
            )}
    />
);

const VehiclePage: React.FC<VehiclePageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehicleAPIPath(params.vehicleId));

    return (
        <Page
            p={0}
            Header={<PageHeader vehicle={vehicle} overDueRemindersBadge={vehicle ? getOverdueRemindersCount(vehicle) : undefined} />}
        >
            <LinkPreload path={[
                vehicleAPIPath(params.vehicleId),
                recordsAPIPath(params.vehicleId),
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
