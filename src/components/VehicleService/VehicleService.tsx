import { AddIcon } from '@chakra-ui/icons';
import {
    Container, Flex, HStack, Button, Spacer, Box, Heading, Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import Search from 'components/Search';
import VehicleRecordsTable, { SkeletonVehicleRecordsTable } from 'components/VehicleRecordsTable';
import { intlFormat } from 'date-fns';
import useRequest from 'hooks/useRequest';
import useSearchQuery from 'hooks/useSearchQuery';
import { VehicleRecord, vehicleRecordsPath } from 'queries/records';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { parseDateISO } from 'utils/date';

export interface VehicleServiceProps {
    vehicleId: string;
}

export const VehicleService: React.FC<VehicleServiceProps> = ({ vehicleId }) => {
    const { data: vehicle, loading: vehicleLoading } = useRequest<Vehicle>(vehiclePath(vehicleId));
    const { data: records, loading: recordsLoading } = useRequest<VehicleRecord[]>(vehicleRecordsPath(vehicleId));

    const { searchQuery, queryResults, setSearchQuery } = useSearchQuery(records, (item, query) => {
        const re = new RegExp(query, 'gi');
        const date = intlFormat(parseDateISO(item.date), { month: 'short', year: 'numeric', day: 'numeric' });

        return re.test(item.notes) || re.test(date);
    });

    const anyLoading = vehicleLoading || recordsLoading;
    const recordsResults = (searchQuery ? queryResults : records) ?? [];

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    return (
        <Container maxW="container.xl">
            <Flex mb={6}>
                <HStack spacing={6}>
                    <Link href={`/vehicles/${vehicleId}/add`} passHref>
                        <Button as="a" colorScheme="brand" size="sm" leftIcon={<AddIcon />}>
                            Add...
                        </Button>
                    </Link>
                </HStack>
                <Spacer minW={[6, null]} />
                <Search onChangeText={handleSearch} />
            </Flex>

            {anyLoading && (
            <Box shadow="lg" p={4}>
                <SkeletonVehicleRecordsTable />
            </Box>
            )}

            {vehicle && Boolean(recordsResults?.length) && (
            <Box shadow="lg" p={4}>
                <VehicleRecordsTable records={recordsResults} enableCost={vehicle.enableCost} distanceUnit={vehicle.distanceUnit} />
            </Box>
            )}

            {Boolean(!anyLoading && !records?.length) && (
            <Box>
                <Heading>
                    You don&apos;t have any records yet
                </Heading>
                <Text>Try adding your purchase as the first one</Text>
            </Box>
            )}

            {Boolean(searchQuery && !queryResults.length) && (
            <Box>
                <Heading>
                    No results
                </Heading>
                <Text>Try searching a date or note</Text>
            </Box>
            )}
        </Container>
    );
};

export default VehicleService;
