import {
    Center,
    Container, Heading, TabPanel, TabPanels,
} from '@chakra-ui/react';
import LinkPreload from 'components/common/LinkPreload';
import Page from 'components/common/Page';
import TabsHeader from 'components/common/TabsHeader';
import Logo from 'components/Logo';
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

const VehicleSharePage: React.FC<VehiclePageProps> = ({ params }) => {
    const vehicleAPI = vehicleAPIPath(params.vehicleId, isShared);
    const recordsAPI = recordsAPIPath(params.vehicleId, isShared);

    const { data: vehicle, error } = useRequest<Vehicle>(vehicleAPI);

    return (
        <Page
            p={0}
            Header={<PageHeader vehicle={vehicle} />}
            contextValue={{ isShared }}
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
