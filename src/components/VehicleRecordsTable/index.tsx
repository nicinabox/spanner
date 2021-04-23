import { Text, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import { format } from 'date-fns';
import { VehicleRecord } from 'queries/vehicles';
import React from 'react';
import { formatCurrency } from 'utils/number';
import { formatMileage, sortRecordsNewestFirst } from 'utils/vehicle';

export interface VehicleRecordsTableProps {
    records: VehicleRecord[];
    distanceUnit: string;
}

const getNextRecordWithMileage = (currentIdx: number, arr: VehicleRecord[]): VehicleRecord | undefined => {
    let found: VehicleRecord | undefined;
    for (let i = currentIdx + 1; i < arr.length; i++) {
        const record = arr[i];
        if (record.mileage) {
            found = record;
            break;
        }
    }
    return found;
}

const getDeltaMileage = (record: VehicleRecord, olderRecord: VehicleRecord) => {
    if (!record.mileage) return;
    return record.mileage - olderRecord.mileage;
}

export const VehicleRecordsTable: React.FC<VehicleRecordsTableProps> = ({ records, distanceUnit }) => {
    const reverseChronoRecords = sortRecordsNewestFirst(records);

    return (
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
                {reverseChronoRecords.map((record, i, arr) => {
                    const nextRecord = getNextRecordWithMileage(i, arr);
                    const deltaMileage = nextRecord ? getDeltaMileage(record, nextRecord) : undefined;

                    return (
                        <Tr key={record.id}>
                            <Td whiteSpace="nowrap" w={100}>{format(new Date(record.date), 'MMM dd, yyy')}</Td>
                            <Td whiteSpace="nowrap" w={100}>{record.cost && formatCurrency(Number(record.cost))}</Td>
                            <Td whiteSpace="nowrap" w={120}>
                                {Boolean(Number(record.mileage)) && formatMileage(record.mileage, distanceUnit)}
                                {deltaMileage !== undefined && (
                                    <>
                                        {' '}
                                        <Text fontSize="xs" color="gray">
                                            (+{deltaMileage})
                                        </Text>
                                    </>
                                )}
                            </Td>
                            <Td>
                                {record.notes}
                            </Td>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    );
};

export default VehicleRecordsTable;
