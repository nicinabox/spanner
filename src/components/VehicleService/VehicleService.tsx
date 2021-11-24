import { AddIcon } from '@chakra-ui/icons';
import {
    Box, Container, Flex, Heading, HStack, LightMode, Spacer, Text,
} from '@chakra-ui/react';
import EmptyState from 'components/common/EmptyState';
import LinkButton from 'components/common/LinkButton';
import Search from 'components/Search';
import VehicleColorIndicator from 'components/VehicleColorIndicator';
import VehicleRecordsTable from 'components/VehicleRecordsTable';
import VehicleStats from 'components/VehicleStats';
import { intlFormat } from 'date-fns';
import useRequest from 'hooks/useRequest';
import useSearchQuery from 'hooks/useSearchQuery';
import qs from 'qs';
import { recordsAPIPath, VehicleRecord } from 'queries/records';
import { Vehicle, vehicleAPIPath } from 'queries/vehicles';
import React from 'react';
import { parseDateUTC } from 'utils/date';
import { vehicleAddPath, vehicleImportPath } from 'utils/resources';

export interface VehicleServiceProps {
    vehicleId: string;
    isShared?: boolean;
}

export const VehicleService: React.FC<VehicleServiceProps> = ({ vehicleId, isShared = false }) => {
    const { data: vehicle, loading: vehicleLoading } = useRequest<Vehicle>(vehicleAPIPath(vehicleId, isShared));
    const { data: records, loading: recordsLoading } = useRequest<VehicleRecord[]>(recordsAPIPath(vehicleId, isShared));

    const { searchQuery, queryResults, setSearchQuery } = useSearchQuery(records, (item, query) => {
        const re = new RegExp(query, 'gi');
        const date = intlFormat(parseDateUTC(item.date), { month: 'short', year: 'numeric', day: 'numeric' });

        return re.test(item.notes) || re.test(date) || re.test(item.mileage.toString());
    });

    const anyLoading = vehicleLoading || recordsLoading;
    const isEmpty = !anyLoading && !records?.length;
    const recordsResults = searchQuery ? queryResults : records;

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    if (isEmpty && !isShared) {
        return (
            <EmptyState
                heading="Add your vehicle's history"
                details="Try adding your purchase as the first record."
                action={(
                    <HStack spacing={6}>
                        <LinkButton href={`${vehicleAddPath(vehicleId)}?${qs.stringify({ notes: 'Purchase' })}`} shadow="lg">
                            Add Purchase
                        </LinkButton>
                        <LinkButton href={`${vehicleImportPath(vehicleId)}`} variant="ghost">
                            Import History
                        </LinkButton>
                    </HStack>
                )}
            />
        );
    }

    if (isEmpty && isShared) {
        return (
            <EmptyState
                heading="No history yet"
                details="This vehicle is being shared but doesn't have any history yet."
            />
        );
    }

    return (
        <Container maxW="container.lg">
            {isShared && vehicle && (
                <HStack spacing={2} mb={10}>
                    <VehicleColorIndicator size={8} color={vehicle?.color} />
                    <Heading size="lg">{vehicle?.name}</Heading>
                </HStack>
            )}

            {vehicle && records && (
                <VehicleStats vehicle={vehicle} records={records} isShared={isShared} />
            )}

            <Flex mb={6} direction="row-reverse">
                {!vehicle?.retired && !isShared && (
                    <Flex>
                        <LightMode>
                            <LinkButton href={vehicleAddPath(vehicleId)} size="md" leftIcon={<AddIcon />} shadow="lg">
                                Add...
                            </LinkButton>
                        </LightMode>
                    </Flex>
                )}
                <Spacer minW={vehicle?.retired || isShared ? [null] : [4, null]} />
                <Search onChangeText={handleSearch} />
            </Flex>

            {(anyLoading || Boolean(records?.length)) && (
                <VehicleRecordsTable
                    vehicleId={vehicleId}
                    records={recordsResults}
                    distanceUnit={vehicle?.distanceUnit}
                    preferences={vehicle?.preferences}
                    isShared={isShared}
                />
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
