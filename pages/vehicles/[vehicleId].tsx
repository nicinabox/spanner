import { HStack, TabPanel, TabPanels } from '@chakra-ui/react';
import BackButton from 'components/common/BackButton';
import LinkPreload from 'components/common/LinkPreload';
import Page from 'components/common/Page';
import TabsHeader from 'components/common/TabsHeader';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import { prefetch } from 'utils/queries';
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
    },
    fallback: {
        vehicle: API.Vehicle;
        records: API.Record[];
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

const VehiclePage: React.FC<VehiclePageProps> = ({ params, fallback }) => {
    const { vehicle } = fallback;

    return (
        <Page
            p={0}
            fallback={{
                [vehicleAPIPath(params.vehicleId)]: fallback.vehicle,
                [recordsAPIPath(params.vehicleId)]: fallback.records,
            }}
            Header={(
                <PageHeader
                    vehicle={vehicle}
                    overDueRemindersBadge={vehicle ? getOverdueRemindersCount(vehicle) : undefined}
                />
              )}
        >
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

    let fallback = {};

    const [_vehicle, _records] = await Promise.allSettled([
        prefetch<API.Vehicle>(req, vehicleAPIPath(params.vehicleId)),
        prefetch<API.Record[]>(req, recordsAPIPath(params.vehicleId)),
    ]);

    if (_vehicle.status === 'fulfilled') {
        const { data: vehicle, error } = _vehicle.value;

        if (error) {
            return {
                notFound: true,
            };
        }

        fallback = { ...fallback, vehicle };
    }

    if (_records.status === 'fulfilled') {
        const { data: records } = _records.value;
        fallback = { ...fallback, records };
    }

    return {
        props: {
            params,
            fallback,
        },
    };
});

export default VehiclePage;
