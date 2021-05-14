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

const VehicleStat = ({ label, children }) => (
    <Stat minW="max-content">
        <StatLabel>{label}</StatLabel>
        <StatNumber>
            {children}
        </StatNumber>
    </Stat>
);

export const VehicleStats: React.FC<VehicleStatsProps> = ({ vehicle, records }) => {
    const [oldestRecord] = sortRecordsOldestFirst(records);

    return (
        <Box overflowY="hidden" overflowX="auto" maxW="calc(100vw - 32px)">
            <HStack spacing={[8, null, 5]} mb={10}>
                {vehicle.estimatedMileage && (
                    <VehicleStat label="Estimated mileage">
                        {formatEstimatedMileage(vehicle)}
                    </VehicleStat>
                )}
                {vehicle.milesPerYear && (
                    <VehicleStat label="Yearly mileage">
                        {formatMilesPerYear(vehicle)}
                    </VehicleStat>
                )}
                {oldestRecord && (
                    <VehicleStat label="Since">
                        {intlFormat(parseDateISO(oldestRecord?.date), { month: 'short', year: 'numeric', day: 'numeric' })}
                    </VehicleStat>
                )}
                <VehicleStat label="VIN">
                    {vehicle.vin || <Link href={`/vehicles/${vehicle.id}/edit`}>Add VIN...</Link>}
                </VehicleStat>
            </HStack>
        </Box>
    );
};

export default VehicleStats;
