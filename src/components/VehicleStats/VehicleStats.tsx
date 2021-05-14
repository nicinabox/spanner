import {
    Stat, StatLabel, StatNumber, StatHelpText, Flex, Box, HStack,
} from '@chakra-ui/react';
import { intlFormat } from 'date-fns';
import Link from 'next/link';
import { VehicleRecord } from 'queries/records';
import { Vehicle } from 'queries/vehicles';
import React from 'react';
import { parseDateISO } from 'utils/date';
import { formatEstimatedMileage, formatMilesPerYear, sortRecordsOldestFirst } from 'utils/vehicle';

export interface VehicleStatsProps {
    vehicle: Vehicle;
    records: VehicleRecord[];
}

export const VehicleStats: React.FC<VehicleStatsProps> = ({ vehicle, records }) => {
    const [oldestRecord] = sortRecordsOldestFirst(records);

    return (
        <Box overflowY="hidden" overflowX="auto" maxW="calc(100vw - 32px)">
            <HStack spacing={5} mb={10}>
                {oldestRecord && (
                    <Stat>
                        <StatLabel>Since</StatLabel>
                        <StatNumber minW="max-content">
                            {intlFormat(parseDateISO(oldestRecord?.date), { month: 'short', year: 'numeric', day: 'numeric' })}
                        </StatNumber>
                    </Stat>
                )}
                {vehicle.estimatedMileage && (
                    <Stat>
                        <StatLabel minW="max-content">Estimated mileage</StatLabel>
                        <StatNumber minW="max-content">{formatEstimatedMileage(vehicle)}</StatNumber>
                    </Stat>
                )}
                {vehicle.milesPerYear && (
                    <Stat>
                        <StatLabel minW="max-content">Yearly mileage</StatLabel>
                        <StatNumber minW="max-content">{formatMilesPerYear(vehicle)}</StatNumber>
                    </Stat>
                )}
                <Stat>
                    <StatLabel>VIN</StatLabel>
                    <StatNumber>
                        {vehicle.vin || <Link href={`/vehicles/${vehicle.id}/edit`}>Add VIN...</Link>}
                    </StatNumber>
                </Stat>
            </HStack>
        </Box>
    );
};

export default VehicleStats;
