import {
    Center, TabPanel, TabPanels,
} from '@chakra-ui/react';
import LinkPreload from 'components/common/LinkPreload';
import Page from 'components/common/Page';
import TabsHeader from 'components/common/TabsHeader';
import Logo from 'components/Logo';
import VehicleService from 'components/VehicleService';
import useRequest from 'hooks/useRequest';
import { recordsAPIPath } from 'queries/records';
import { fetchVehicle, vehicleAPIPath } from 'queries/vehicles';
import React from 'react';
import { prefetch } from 'utils/queries';
import { withSession } from 'utils/session';

export interface VehiclePageProps {
    params: {
        vehicleId: string;
    }
    fallback: {
        vehicle: API.Vehicle;
        records: API.Record[];
    }
}

const isShared = true;

const PageHeader = ({ vehicle }) => (
    <TabsHeader
        hashchange
        tabs={[]}
        CenterComponent={(
            <Center flex={1} py={2}>
                <Logo height={30} />
            </Center>
          )}
    />
);

const VehicleSharePage: React.FC<VehiclePageProps> = ({ params, fallback }) => {
    const vehicleAPI = vehicleAPIPath(params.vehicleId, isShared);
    const recordsAPI = recordsAPIPath(params.vehicleId, isShared);

    const { vehicle } = fallback;

    return (
        <Page
            p={0}
            Header={<PageHeader vehicle={vehicle} />}
            contextValue={{ isShared }}
            fallback={{
                [vehicleAPI]: fallback.vehicle,
                [recordsAPI]: fallback.records,
            }}
        >
            <TabPanels>
                <TabPanel px={0}>
                    <VehicleService
                        vehicleId={params.vehicleId}
                    />
                </TabPanel>
            </TabPanels>
        </Page>
    );
};

export const getServerSideProps = withSession(async ({ req, params }) => {
    let fallback = {};

    const apiPaths = [
        vehicleAPIPath(params.vehicleId, isShared),
        recordsAPIPath(params.vehicleId, isShared),
    ];
    const [_vehicle, _records] = await Promise.allSettled(apiPaths.map((path) => prefetch(req, path)));

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

export default VehicleSharePage;
