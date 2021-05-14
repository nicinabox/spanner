import {
    Box, Flex, Skeleton, Table, Tbody, Td, Text, Th, Thead, Tr,
} from '@chakra-ui/react';
import { intlFormat } from 'date-fns';
import { VehicleRecord } from 'queries/records';
import React from 'react';
import { parseDateISO } from 'utils/date';
import { formatCurrency } from 'utils/number';
import { formatMileage, sortRecordsNewestFirst } from 'utils/vehicle';

export interface VehicleRecordsTableProps {
    enableCost: boolean;
    records: VehicleRecord[];
    distanceUnit: string;
}

const getNextRecordWithMileage = (currentIdx: number, arr: VehicleRecord[]): VehicleRecord | undefined => {
    let found: VehicleRecord | undefined;
    // eslint-disable-next-line no-plusplus
    for (let i = currentIdx + 1; i < arr.length; i++) {
        const record = arr[i];
        if (record.mileage) {
            found = record;
            break;
        }
    }
    return found;
};

const getDeltaMileage = (record: VehicleRecord, olderRecord: VehicleRecord): number | undefined => {
    if (!record.mileage) return undefined;
    return record.mileage - olderRecord.mileage;
};

export const SkeletonVehicleRecordsTable = () => (
    <>
        <Box display={['block', 'none']}>
            <Skeleton mb={2} h={3} />
            <Skeleton mb={2} h={3} />
            <Skeleton mb={2} h={3} />
        </Box>

        <Table size="sm" data-testid="SkeletonVehicleRecordsTable" display={['none', null]}>
            <Thead>
                <Tr>
                    <Th>Date</Th>
                    <Th>Mileage</Th>
                    <Th>Notes</Th>
                </Tr>
            </Thead>
            <Tbody>
                {[1, 2, 3].map((n) => (
                    <Tr key={n}>
                        <Td w={100}>
                            <Skeleton h={3} />
                        </Td>
                        <Td w={100}>
                            <Skeleton h={3} />
                        </Td>
                        <Td>
                            <Skeleton h={3} maxW={300} />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    </>
);

const Row = (props) => (
    <Flex
        py={[2, null, 0]}
        display={['flex', null, 'table-row']}
        flexFlow={['wrap', null, 'nowrap']}
        alignItems="flex-start"
        borderBottomColor="gray.200"
        borderBottomWidth="1px"
        {...props}
    />
);

const Cell = (props) => (
    <Flex
        px={[0, null, 4]}
        py={[0, null, 2]}
        display={['flex', null, 'table-cell']}
        {...props}
    />
);

const FlexTable = (props) => (
    <Flex
        w="100%"
        direction="column"
        flexFlow="column nowrap"
        display={['flex', null, 'table']}
        __css={{ 'border-collapse': 'collapse' }}
        {...props}
    />
);

export const VehicleRecordsTable: React.FC<VehicleRecordsTableProps> = ({ records, enableCost, distanceUnit }) => {
    const reverseChronoRecords = sortRecordsNewestFirst(records);

    const basis = {
        date: 120,
        cost: 100,
        mileage: 120,
    };

    return (
        <FlexTable>
            <Row
                fontWeight="bold"
                display={['none', null, 'table-row']}
                borderBottomWidth="2px"
            >
                <Cell basis={basis.date}>Date</Cell>
                {enableCost && <Cell basis={basis.cost}>Cost</Cell>}
                <Cell basis={basis.mileage}>Mileage</Cell>
                <Cell>Notes</Cell>
            </Row>

            {reverseChronoRecords.map((record, i, arr) => {
                const nextRecord = getNextRecordWithMileage(i, arr);
                const deltaMileage = nextRecord ? getDeltaMileage(record, nextRecord) : undefined;

                return (
                    <Row borderBottomWidth={i < arr.length - 1 ? '1px' : 'none'}>
                        <Cell
                            whiteSpace="nowrap"
                            basis={basis.date}
                            fontWeight={['bold', 'bold', 'inherit']}
                            fontSize={['sm', null, 'md']}
                        >
                            {intlFormat(parseDateISO(record.date), { month: 'short', year: 'numeric', day: 'numeric' })}
                        </Cell>

                        {enableCost && (
                            <Cell
                                whiteSpace="nowrap"
                                basis={basis.cost}
                                fontSize={['sm', null, 'md']}
                            >
                                {record.cost ? formatCurrency(Number(record.cost)) : '--'}
                            </Cell>
                        )}

                        <Cell
                            whiteSpace="nowrap"
                            alignItems="center"
                            textAlign="right"
                            basis={basis.mileage}
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

                        <Cell basis={['100%', null]} flex={[null, null, 1]}>
                            {record.notes}
                        </Cell>
                    </Row>
                );
            })}
        </FlexTable>
    );
};

export default VehicleRecordsTable;
