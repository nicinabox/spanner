import {
    Text, Table, Thead, Tr, Th, Tbody, Td, Skeleton,
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
    <Table size="sm">
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
);

export const VehicleRecordsTable: React.FC<VehicleRecordsTableProps> = ({ records, enableCost, distanceUnit }) => {
    const reverseChronoRecords = sortRecordsNewestFirst(records);

    return (
        <Table size="sm">
            <Thead>
                <Tr>
                    <Th>Date</Th>
                    {enableCost && <Th>Cost</Th>}
                    <Th>Mileage</Th>
                    <Th>Notes</Th>
                </Tr>
            </Thead>
            <Tbody>
                {reverseChronoRecords.map((record, i, arr) => {
                    const nextRecord = getNextRecordWithMileage(i, arr);
                    const deltaMileage = nextRecord ? getDeltaMileage(record, nextRecord) : undefined;

                    return (
                        <Tr key={record.id}>
                            <Td whiteSpace="nowrap" w={100}>
                                {intlFormat(parseDateISO(record.date), { month: 'short', year: 'numeric', day: 'numeric' })}
                            </Td>
                            {enableCost && (
                                <Td whiteSpace="nowrap" w={100}>
                                    {record.cost && formatCurrency(Number(record.cost))}
                                </Td>
                            )}
                            <Td whiteSpace="nowrap" w={120}>
                                {Boolean(Number(record.mileage)) && formatMileage(record.mileage, distanceUnit)}
                                {deltaMileage !== undefined && (
                                    <>
                                        {' '}
                                        <Text fontSize="xs" color="gray">
                                            (+
                                            {deltaMileage}
                                            )
                                        </Text>
                                    </>
                                )}
                            </Td>
                            <Td>
                                {record.notes}
                            </Td>
                        </Tr>
                    );
                })}
            </Tbody>
        </Table>
    );
};

export default VehicleRecordsTable;
