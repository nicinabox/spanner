import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, HStack, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react';
import Header from 'components/Header';
import Page from 'components/Page';
import Search from 'components/Search';
import TabMenu from 'components/TabMenu';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import VehicleNotes from 'components/VehicleNotes';
import VehicleRecordsTable from 'components/VehicleRecordsTable';
import VehicleSummary from 'components/VehicleSummary';
import Link from 'next/link';
import { createAPIRequest } from 'queries/config';
import { fetchRecords, fetchVehicle, Vehicle, VehicleRecord } from 'queries/vehicles';
import React from 'react';
import { authRedirect, withSession } from 'utils/session';

interface VehiclePageProps {
    vehicle: Vehicle;
    records: VehicleRecord[];
}

const VehiclePage: React.FC<VehiclePageProps> = ({ vehicle, records }) => {
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
                            <Box shadow="lg" p={4}>
                                <VehicleRecordsTable records={records} distanceUnit={vehicle.distanceUnit} />
                            </Box>
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

    const { vehicleId } = params;

    const api = createAPIRequest(req);

    try {
        const results = await Promise.allSettled([
            fetchVehicle(api, vehicleId),
            fetchRecords(api, vehicleId),
        ]);

        const [vehicle, records] = results.map((result) => {
            if (result.status === 'fulfilled') {
                return result.value.data;
            }
        });

        return {
            props: {
                vehicle,
                records,
            },
        };
    } catch(err) {
        return {
            props: {
                error: err.data.error
            }
        }
    }
})

export default VehiclePage;
