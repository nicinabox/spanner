import {
    Container, Heading, TabPanel, TabPanels,
} from '@chakra-ui/react';
import LinkPreload from 'components/common/LinkPreload';
import Page from 'components/common/Page';
import TabsHeader from 'components/common/TabsHeader';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import VehicleService from 'components/VehicleService';
import useRequest from 'hooks/useRequest';
import { recordsAPIPath } from 'queries/records';
import { Vehicle, vehicleAPIPath } from 'queries/vehicles';
import React from 'react';
import { withSession } from 'utils/session';

export interface VehiclePageProps {
    params: {
        vehicleId: string;
    }
}

const PageHeader = ({ vehicle }) => (
    <TabsHeader
        hashchange
        tabs={[]}
        LeftComponent={(
            <VehicleActionsMenu vehicle={vehicle} />
        )}
    />
);

const shareAPI = true;

const VehicleSharePage: React.FC<VehiclePageProps> = ({ params }) => {
    const vehicleAPI = vehicleAPIPath(params.vehicleId, shareAPI);
    const recordsAPI = recordsAPIPath(params.vehicleId, shareAPI);

    const { data: vehicle, error } = useRequest<Vehicle>(vehicleAPI);

    return (
        <Page
            p={0}
            Header={<PageHeader vehicle={vehicle} />}
        >
            <LinkPreload path={[
                vehicleAPI,
                recordsAPI,
            ]}
            />

            <TabPanels>
                <TabPanel px={0}>
                    {error ? (
                        <Container maxW="container.sm">
                            <Heading>{error.response.statusText}</Heading>
                        </Container>
                    ) : (
                        <VehicleService
                            vehicleId={params.vehicleId}
                            shareAPI={shareAPI}
                        />
                    )}
                </TabPanel>
            </TabPanels>
        </Page>
    );
};

export const getServerSideProps = withSession(async ({ req, params }) => {
    return {
        props: {
            params,
        },
    };
});

export default VehicleSharePage;
