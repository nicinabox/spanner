import { Box, Button, Container, Flex, Heading, HStack, Spacer, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Header from 'components/Header';
import Page from 'components/Page';
import Search from 'components/Search';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import Link from 'next/link';
import { createAPIRequest } from 'queries/config';
import { fetchRecords, fetchVehicle, Vehicle, VehicleRecord } from 'queries/vehicles';
import React from 'react';
import { authRedirect, withSession } from 'utils/session';
import { formatEstimatedMilage, formatMilesPerYear } from 'utils/vehicle';
import { format } from 'date-fns';
import { formatCurrency, formatNumber } from 'utils/number';
import marked from 'marked';

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
        <Page Header={() => (
            <Header
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
        )}>
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
                    <Text color="brand.400" fontWeight="500">
                        Since <strong>{format(new Date(records[0].date), 'MMMM d, yyy')}</strong>, you drive about <strong>{formatMilesPerYear(vehicle)} per year</strong> for an estimated <strong>{formatEstimatedMilage(vehicle)}</strong>.
                    </Text>
                </HStack>
            </Flex>

            <Stack direction={["column", "row"]} spacing={16}>
                <Box flex={1}>
                    <Heading size="md" mb={6}>
                        Service
                    </Heading>
                    <Table size="sm">
                        <Thead>
                            <Tr>
                                <Th>Date</Th>
                                <Th>Cost</Th>
                                <Th>Mileage</Th>
                                <Th>Notes</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {reverseChronoRecords.map((record) => {
                                return (
                                    <Tr>
                                        <Td whiteSpace="nowrap">{format(new Date(record.date), 'MMM dd, yyy')}</Td>
                                        <Td>{record.cost && formatCurrency(record.cost)}</Td>
                                        <Td>{Boolean(Number(record.mileage)) && formatNumber(record.mileage)}</Td>
                                        <Td>{record.notes}</Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </Box>

                <Box width="30%">
                    <Heading size="md" mb={6}>
                        Notes
                    </Heading>
                    <Box dangerouslySetInnerHTML={{
                        __html: marked(vehicle.notes),
                    }} />
                </Box>
            </Stack>
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
