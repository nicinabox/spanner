import { HStack, TabPanel, TabPanels } from '@chakra-ui/react';
import BackButton from 'components/common/BackButton';
import LinkPreload from 'components/common/LinkPreload';
import Page from 'components/common/Page';
import TabsHeader from 'components/common/TabsHeader';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import useRequest from 'hooks/useRequest';
import { recordsAPIPath } from 'queries/records';
import { vehicleAPIPath } from 'queries/vehicles';
import React, { Suspense } from 'react';
import { getOverdueRemindersCount } from 'utils/reminders';
import { vehiclesPath } from 'utils/resources';
import { authRedirect, withSession } from 'utils/session';

const VehicleService = React.lazy(() => import('components/VehicleService'));
const VehicleReminders = React.lazy(() => import('components/VehicleReminders'));
const VehicleNotes = React.lazy(() => import('components/VehicleNotes'));

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
            <HStack spacing={2} minW={0}>
                <BackButton href={vehiclesPath()}>
                    Vehicles
                </BackButton>

                <VehicleActionsMenu vehicle={vehicle} />
            </HStack>
            )}
    />
);

const VehiclePage: React.FC<VehiclePageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<API.Vehicle>(vehicleAPIPath(params.vehicleId));

    return (
        <Page
            p={0}
            Header={(
                <PageHeader
                    vehicle={vehicle}
                    overDueRemindersBadge={vehicle ? getOverdueRemindersCount(vehicle) : undefined}
                />
              )}
        >
            <LinkPreload path={[
                vehicleAPIPath(params.vehicleId),
                recordsAPIPath(params.vehicleId),
            ]}
            />

            <TabPanels>
                <TabPanel px={0}>
                    <Suspense fallback={null}>
                        <VehicleService vehicleId={params.vehicleId} />
                    </Suspense>
                </TabPanel>
                <TabPanel px={0}>
                    <Suspense fallback={null}>
                        <VehicleReminders vehicleId={params.vehicleId} />
                    </Suspense>
                </TabPanel>
                <TabPanel px={0}>
                    {vehicle && (
                        <Suspense fallback={null}>
                            <VehicleNotes vehicle={vehicle} />
                        </Suspense>
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
