import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, Heading, Text, HStack, Spacer, Tab, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import Header from 'components/Header';
import Page from 'components/Page';
import Search from 'components/Search';
import TabMenu from 'components/TabMenu';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import VehicleNotes from 'components/VehicleNotes';
import VehicleRecordsTable from 'components/VehicleRecordsTable';
import VehicleSummary from 'components/VehicleSummary';
import useRequest from 'hooks/useRequest';
import Link from 'next/link';
import { fetchRecords, VehicleRecord, vehicleRecordsPath } from 'queries/records';
import { fetchVehicle, Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { fetchInitialData } from 'utils/queries';
import { authRedirect, withSession } from 'utils/session';

export interface VehiclePageProps {
    data?: {
        vehicle: Vehicle;
        records: VehicleRecord[];
    }
    error?: string
    params: {
        vehicleId: string;
    }
}

const VehiclePage: React.FC<VehiclePageProps> = ({ params, ...props }) => {
    const { data: vehicle } = useRequest<Vehicle>(vehiclePath(params.vehicleId), { initialData: props.data.vehicle })
    const { data: records } = useRequest<VehicleRecord[]>(vehicleRecordsPath(params.vehicleId), { initialData: props.data.records })

    return (
        <Page
            p={0}
            Header={() => (
                <Header
                    mb={0}
                    LeftComponent={
                        <HStack spacing={2}>
                            <Link href="/" passHref>
                                <Button
                                    as="a"
                                    leftIcon={<ArrowBackIcon />}
                                    size="sm"
                                    variant="solid"
                                    colorScheme="gray"
                                >
                                    Vehicles
                                </Button>
                            </Link>
                            <VehicleActionsMenu vehicle={vehicle} />
                        </HStack>
                    }
                    CenterComponent={<Search />}
                />
            )}
        >
            <Tabs colorScheme="brand" mt={0}>
                <TabMenu>
                    <Tab>Service</Tab>
                    <Tab>Notes</Tab>
                </TabMenu>

                <TabPanels>
                    <TabPanel pl={0} pr={0}>
                        <Container maxW="container.xl">
                            <Flex mb={6}>
                                <HStack spacing={2}>
                                    <Link href={`/vehicles/${vehicle.id}/add`} passHref>
                                        <Button as="a" colorScheme="brand" size="sm" leftIcon={<AddIcon />}>
                                            Add...
                                        </Button>
                                    </Link>
                                </HStack>
                                <Spacer />
                                <HStack spacing={8}>
                                    <VehicleSummary vehicle={vehicle} records={records} />
                                </HStack>
                            </Flex>
                                {Boolean(records.length) ? (
                                    <Box shadow="lg" p={4}>
                                        <VehicleRecordsTable records={records} distanceUnit={vehicle.distanceUnit} />
                                    </Box>
                                ) : (
                                    <Box>
                                        <Heading>
                                            You don't have any records yet
                                        </Heading>
                                        <Text>Try adding your purchase as the first one</Text>
                                    </Box>
                                )}
                        </Container>
                    </TabPanel>
                    <TabPanel>
                        <Container maxW="container.md">
                            <VehicleNotes notes={vehicle.notes} />
                        </Container>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Page>
    )
}

export const getServerSideProps = withSession(async function ({ req, params }) {
    const redirect = authRedirect(req)
    if (redirect) return redirect;

    const initialData = await fetchInitialData(req, async (api) => {
        const { vehicleId } = params;

        const results = await Promise.allSettled([
            fetchVehicle(api, vehicleId),
            fetchRecords(api, vehicleId),
        ]);

        const [vehicle, records] = results.map((result) => {
            if (result.status === 'fulfilled') {
                return result.value;
            }
        });

        return {
            vehicle: vehicle as Vehicle,
            records: records as VehicleRecord[],
        }
    });

    return {
        props: {
            params,
            ...initialData,
        }
    }
})

export default VehiclePage;
