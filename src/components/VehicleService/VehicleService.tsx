import { AddIcon } from '@chakra-ui/icons';
import {
    Box, Container, Flex, Heading, LightMode, Spacer, Text,
} from '@chakra-ui/react';
import LinkButton from 'components/common/LinkButton';
import Search from 'components/Search';
import VehicleRecordsTable from 'components/VehicleRecordsTable';
import VehicleStats from 'components/VehicleStats';
import { intlFormat } from 'date-fns';
import useRequest from 'hooks/useRequest';
import useSearchQuery from 'hooks/useSearchQuery';
import { VehicleRecord, recordsAPIPath } from 'queries/records';
import { Vehicle, vehicleAPIPath } from 'queries/vehicles';
import React from 'react';
import { parseDateUTC } from 'utils/date';
import { vehicleAddPath } from 'utils/resources';

export interface VehicleServiceProps {
    vehicleId: string;
}

export const VehicleService: React.FC<VehicleServiceProps> = ({ vehicleId }) => {
    const { data: vehicle, loading: vehicleLoading } = useRequest<Vehicle>(vehicleAPIPath(vehicleId));
    const { data: records, loading: recordsLoading } = useRequest<VehicleRecord[]>(recordsAPIPath(vehicleId));

    const { searchQuery, queryResults, setSearchQuery } = useSearchQuery(records, (item, query) => {
        const re = new RegExp(query, 'gi');
        const date = intlFormat(parseDateUTC(item.date), { month: 'short', year: 'numeric', day: 'numeric' });

        return re.test(item.notes) || re.test(date) || re.test(item.mileage.toString());
    });

    const anyLoading = vehicleLoading || recordsLoading;
    const recordsResults = searchQuery ? queryResults : records;

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    return (
        <Container maxW="container.lg">
            {vehicle && records && (
                <VehicleStats vehicle={vehicle} records={records} />
            )}

            <Flex mb={6} direction="row-reverse">
                {!vehicle?.retired && (
                    <Flex>
                        <LightMode>
                            <LinkButton href={vehicleAddPath(vehicleId)} size="md" leftIcon={<AddIcon />} shadow="lg">
                                Add...
                            </LinkButton>
                        </LightMode>
                    </Flex>
                )}
                <Spacer minW={vehicle?.retired ? [null] : [4, null]} />
                <Search onChangeText={handleSearch} />
            </Flex>

            {(anyLoading || Boolean(records?.length)) ? (
                <VehicleRecordsTable
                    vehicleId={vehicleId}
                    records={recordsResults}
                    enableCost={vehicle?.enableCost}
                    distanceUnit={vehicle?.distanceUnit}
                />
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
                    <Text>Try searching by date, mileage, or notes.</Text>
                </Box>
            )}
        </Container>
    );
};

export default VehicleService;
