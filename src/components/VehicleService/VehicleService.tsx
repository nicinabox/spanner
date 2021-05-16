import { AddIcon } from '@chakra-ui/icons';
import {
    Container, Flex, HStack, Button, Spacer, Box, Heading, Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import Search from 'components/Search';
import VehicleRecordsTable from 'components/VehicleRecordsTable';
import { intlFormat } from 'date-fns';
import useRequest from 'hooks/useRequest';
import useSearchQuery from 'hooks/useSearchQuery';
import { VehicleRecord, vehicleRecordsPath } from 'queries/records';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React from 'react';
import { parseDateISO } from 'utils/date';
import VehicleStats from 'components/VehicleStats';

export interface VehicleServiceProps {
    vehicleId: string;
}

export const VehicleService: React.FC<VehicleServiceProps> = ({ vehicleId }) => {
    const { data: vehicle, loading: vehicleLoading } = useRequest<Vehicle>(vehiclePath(vehicleId));
    const { data: records, loading: recordsLoading } = useRequest<VehicleRecord[]>(vehicleRecordsPath(vehicleId));

    const { searchQuery, queryResults, setSearchQuery } = useSearchQuery(records, (item, query) => {
        const re = new RegExp(query, 'gi');
        const date = intlFormat(parseDateISO(item.date), { month: 'short', year: 'numeric', day: 'numeric' });

        return re.test(item.notes) || re.test(date) || re.test(item.mileage.toString());
    });

    const anyLoading = vehicleLoading || recordsLoading;
    const recordsResults = searchQuery ? queryResults : records;

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    return (
        <Container maxW="container.xl">
            {vehicle && records && (
                <VehicleStats vehicle={vehicle} records={records} />
            )}

            <Flex mb={6} direction="row-reverse">
                {!vehicle?.retired && (
                    <Flex>
                        <Link href={`/vehicles/${vehicleId}/add`} passHref>
                            <Button as="a" colorScheme="brand" size="md" leftIcon={<AddIcon />}>
                                Add...
                            </Button>
                        </Link>
                    </Flex>
                )}
                <Spacer minW={vehicle?.retired ? [null] : [4, null]} />
                <Search onChangeText={handleSearch} />
            </Flex>

            {(anyLoading || Boolean(records?.length)) ? (
                <Box shadow={['none', 'lg', 'lg']} p={[0, 4]}>
                    <VehicleRecordsTable
                        vehicleId={vehicleId}
                        records={recordsResults}
                        enableCost={vehicle?.enableCost}
                        distanceUnit={vehicle?.distanceUnit}
                    />
                </Box>
            ) : (
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
