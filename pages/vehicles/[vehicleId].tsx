import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, HStack, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import Header from 'components/Header';
import Page from 'components/Page';
import Search from 'components/Search';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import VehicleRecordsTable from 'components/VehicleRecordsTable';
import { format } from 'date-fns';
import marked from 'marked';
import Link from 'next/link';
import { createAPIRequest } from 'queries/config';
import { fetchRecords, fetchVehicle, Vehicle, VehicleRecord } from 'queries/vehicles';
import React from 'react';
import { authRedirect, withSession } from 'utils/session';
import { formatEstimatedMileage, formatMilesPerYear } from 'utils/vehicle';

interface VehiclePageProps {
    vehicle: Vehicle;
    records: VehicleRecord[];
}

const VehiclePage: React.FC<VehiclePageProps> = ({ vehicle, records }) => {
    const reverseChronoRecords = records.sort((a, b) => {
        const byDate = new Date(b.date).getTime() - new Date(a.date).getTime()
        if (byDate) return byDate;
        return b.mileage - a.mileage;
    });

    return (
        <Page
            maxW="none"
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
                <Box bg="brand.100">
                    <Container maxW="container.xl">
                        <TabList>
                            <Tab>Service</Tab>
                            <Tab>Notes</Tab>
                        </TabList>
                    </Container>
                </Box>

                    <TabPanels>
                        <TabPanel pl={0} pr={0}>
                            <Container maxW="container.xl">
                                <Flex mb={12}>
                                    <HStack spacing={2}>
                                        <Button colorScheme="brand" size="sm" variant="ghost"
                                            leftIcon={<AddIcon />}
                                        >
                                            Add Service
                                        </Button>
                                        <Button colorScheme="brand" size="sm" variant="ghost"
                                            leftIcon={<AddIcon />}
                                        >
                                            Add Reminder
                                        </Button>
                                    </HStack>
                                    <Spacer />
                                    <HStack spacing={8}>
                                        <Text color="gray.900" fontWeight="500">
                                            Since <strong>{format(new Date(records[0].date), 'MMMM d, yyy')}</strong>, you drive about <strong>{formatMilesPerYear(vehicle)} per year</strong> for an estimated <strong>{formatEstimatedMileage(vehicle)}</strong>.
                                        </Text>
                                    </HStack>
                                </Flex>
                                <Box shadow="lg" p={4}>
                                    <VehicleRecordsTable records={records} distanceUnit={vehicle.distanceUnit} />
                                </Box>
                            </Container>
                        </TabPanel>
                        <TabPanel>
                            <Container maxW="container.md">
                                <Box dangerouslySetInnerHTML={{
                                    __html: marked(vehicle.notes),
                                }} />
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
