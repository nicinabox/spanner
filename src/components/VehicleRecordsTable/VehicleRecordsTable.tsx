import {
    Box,
    Button,
    Flex, Heading, Skeleton, SkeletonText, Text, useColorModeValue,
} from '@chakra-ui/react';
import { intlFormat } from 'date-fns';
import { mutate } from 'hooks/useMutation';
import { groupBy } from 'lodash';
import Link from 'next/link';
import { VehicleRecord, vehicleRecordPath } from 'queries/records';
import React from 'react';
import { parseDateISO } from 'utils/date';
import { formatCurrency } from 'utils/number';
import { formatMileage, sortRecordsNewestFirst } from 'utils/vehicle';

export interface VehicleRecordsTableProps {
    records: VehicleRecord[] | undefined;
    vehicleId: string;
    enableCost?: boolean;
    distanceUnit?: string;
    isLoaded?: boolean;
}

const getNextRecordWithMileage = (record: VehicleRecord, arr: VehicleRecord[]): VehicleRecord | undefined => {
    const idx = arr.findIndex((r) => r.id === record.id);
    return arr[idx + 1];
};

const getDeltaMileage = (record: VehicleRecord, olderRecord: VehicleRecord): number | undefined => {
    if (!record.mileage) return undefined;
    return record.mileage - olderRecord.mileage;
};

const Row = (props) => {
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Flex
            py={[2, null, 0]}
            display={['flex', null, 'table-row']}
            flexFlow={['wrap', null, 'nowrap']}
            alignItems="flex-start"
            borderBottomColor={borderColor}
            borderBottomWidth="1px"
            {...props}
        />
    );
};

const Cell = (props) => (
    <Flex
        px={[0, null, 4]}
        py={[0, null, 2]}
        display={['flex', null, 'table-cell']}
        verticalAlign="top"
        alignItems="flex-start"
        {...props}
    />
);

const FlexTable = (props) => (
    <Flex
        w="100%"
        direction="column"
        flexFlow="column nowrap"
        display={['flex', null, 'table']}
        sx={{ borderCollapse: 'collapse' }}
        {...props}
    />
);

export const VehicleRecordsTable: React.FC<VehicleRecordsTableProps> = ({
    records, vehicleId, enableCost = false, distanceUnit = 'mi',
}) => {
    const reverseChronoRecords = sortRecordsNewestFirst(records ?? []);
    const recordsByYear = groupBy(reverseChronoRecords, (r) => new Date(r.date).getFullYear());

    const rowColorAlt = useColorModeValue('gray.50', 'gray.900');
    const headerBorderColor = useColorModeValue('gray.300', 'gray.700');

    if (!records) {
        return (
            <FlexTable>
                {[1, 2, 3].map((n) => (
                    <Row key={n} data-testid={`skeleton${n}`}>
                        <Cell mr={[3, null, 'auto']}>
                            <Skeleton h={2} w={100} />
                        </Cell>
                        <Cell flex={[1, null, 'auto']}>
                            <Skeleton h={2} w={100} />
                        </Cell>
                        <Cell pt={[2]} basis={['100%', null]} w="100%">
                            <SkeletonText noOfLines={2} flex={1} />
                        </Cell>
                    </Row>
                ))}
            </FlexTable>
        );
    }

    return (
        <>
            {Object.keys(recordsByYear).sort((a, b) => Number(b) - Number(a)).map((year) => {
                const yearRecords = recordsByYear[year];

                return (
                    <Box key={year}>
                        <Heading
                            size="md"
                            px={[0, null, 4]}
                            pb={2}
                        >
                            {year}
                        </Heading>
                        <FlexTable mb={8}>
                            <Row
                                fontWeight="bold"
                                fontSize="sm"
                                color="gray.600"
                                borderTopWidth="1px"
                                borderTopColor={headerBorderColor}
                                borderBottomColor={headerBorderColor}
                                bg={rowColorAlt}
                                display={['none', null, 'table-row']}
                            >
                                <Cell>Date</Cell>
                                <Cell>Mileage</Cell>
                                {enableCost && <Cell>Cost</Cell>}
                                <Cell>Notes</Cell>
                                <Cell />
                            </Row>

                            {yearRecords.map((record, i) => {
                                const nextRecord = getNextRecordWithMileage(record, reverseChronoRecords);
                                const deltaMileage = nextRecord ? getDeltaMileage(record, nextRecord) : undefined;

                                return (
                                    <Row key={record.id} bg={i % 2 ? rowColorAlt : 'transparent'}>
                                        <Cell
                                            whiteSpace="nowrap"
                                            fontWeight={['bold', null, 'inherit']}
                                            fontSize={['sm', null, 'md']}
                                            mr={[3, null, 'auto']}
                                        >
                                            {intlFormat(parseDateISO(record.date), { month: 'short', day: 'numeric' })}
                                        </Cell>

                                        <Cell
                                            whiteSpace="nowrap"
                                            alignItems="center"
                                            textAlign={['left', null, 'right']}
                                            flex={[1, null, 'auto']}
                                            fontSize={['sm', null, 'md']}
                                        >
                                            {Boolean(Number(record.mileage)) && formatMileage(record.mileage, distanceUnit)}
                                            {deltaMileage !== undefined && (
                                                <Text fontSize="xs" color="gray" ml={1}>
                                                    (+
                                                    {deltaMileage}
                                                    )
                                                </Text>
                                            )}
                                        </Cell>

                                        {enableCost && (
                                            <Cell
                                                whiteSpace="nowrap"
                                                fontSize={['sm', null, 'md']}
                                                textAlign="right"
                                            >
                                                {record.cost ? formatCurrency(Number(record.cost)) : '--'}
                                            </Cell>
                                        )}

                                        <Cell basis={['100%', null]} w="100%">
                                            {record.notes}
                                        </Cell>

                                        <Cell>
                                            <Link passHref href={`/vehicles/${vehicleId}/records/${record.id}/edit`}>
                                                <Button
                                                    as="a"
                                                    size="sm"
                                                    variant="link"
                                                    colorScheme="brand"
                                                    onClick={() => {
                                                        // Preload data for edit form
                                                        mutate(vehicleRecordPath(vehicleId, record.id), record, false);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            </Link>
                                        </Cell>
                                    </Row>
                                );
                            })}
                        </FlexTable>
                    </Box>
                );
            })}
        </>
    );
};

export default VehicleRecordsTable;
