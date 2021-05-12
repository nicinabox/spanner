import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons';
import {
    Box, Button, Container, Flex, Heading, Text, HStack, Spacer, Tab, TabPanel, TabPanels, Tabs, Skeleton, TabList,
} from '@chakra-ui/react';
import Header from 'components/Header';
import LinkPreload from 'components/LinkPreload';
import Page from 'components/Page';
import Search from 'components/Search';
import TabMenu from 'components/TabMenu';
import TabsHeader from 'components/TabsHeader';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import VehicleNotes from 'components/VehicleNotes';
import VehicleRecordsTable from 'components/VehicleRecordsTable';
import VehicleSummary from 'components/VehicleSummary';
import useRequest from 'hooks/useRequest';
import Head from 'next/head';
import Link from 'next/link';
import { VehicleRecord, vehicleRecordsPath } from 'queries/records';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { authRedirect, withSession } from 'utils/session';

export interface VehiclePageProps {
    params: {
        vehicleId: string;
    }
}

const PageHeader = ({ vehicle }) => {
    return (
        <TabsHeader
            tabs={['Service', 'Notes']}
            LeftComponent={(
                <HStack spacing={2}>
                    <Link href="/" passHref>
                        <Button
                            as="a"
                            leftIcon={<ArrowBackIcon />}
                            size="sm"
                            variant="solid"
                            colorScheme="brandInverted"
                        >
                            Vehicles
                        </Button>
                    </Link>

                    <VehicleActionsMenu vehicle={vehicle} />
                </HStack>
            )}
        />
    );
}

const VehiclePage: React.FC<VehiclePageProps> = ({ params }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(params.vehicleId));
    const { data: records } = useRequest<VehicleRecord[]>(vehicleRecordsPath(params.vehicleId));

    return (
        <Page
            p={0}
            Header={<PageHeader vehicle={vehicle} />}
        >
            <LinkPreload path={[
                vehiclePath(params.vehicleId),
                vehicleRecordsPath(params.vehicleId)
            ]} />

            <TabPanels>
                <TabPanel px={0}>
                    <Container maxW="container.xl">
                        <Flex mb={6}>
                            <HStack spacing={2}>
                                <Link href={`/vehicles/${vehicle?.id}/add`} passHref>
                                    <Button as="a" colorScheme="brand" size="sm" leftIcon={<AddIcon />}>
                                        Add...
                                    </Button>
                                </Link>
                            </HStack>
                            <Spacer />
                            <Search />
                        </Flex>
                        <Skeleton isLoaded={Boolean(records && vehicle)} fadeDuration={0}>
                            {records?.length && vehicle ? (
                                <Box shadow="lg" p={4}>
                                    <VehicleRecordsTable records={records} enableCost={vehicle.enableCost} distanceUnit={vehicle.distanceUnit} />
                                </Box>
                            ) : (
                                <Box>
                                    <Heading>
                                        You don't have any records yet
                                    </Heading>
                                    <Text>Try adding your purchase as the first one</Text>
                                </Box>
                            )}
                        </Skeleton>
                    </Container>
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
