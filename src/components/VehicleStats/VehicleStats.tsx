import {
    Stat, StatLabel, StatNumber, Box, HStack, Text,
} from '@chakra-ui/react';
import { intlFormat } from 'date-fns';
import Link from 'next/link';
import { VehicleRecord } from 'queries/records';
import { Vehicle } from 'queries/vehicles';
import React from 'react';
import { parseDateUTC } from 'utils/date';
import lang from 'utils/lang';
import { editVehiclePath } from 'utils/resources';
import { formatEstimatedMileage, formatMilesPerYear, sortRecordsOldestFirst } from 'utils/vehicle';

export interface VehicleStatsProps {
    vehicle: Vehicle;
    records: VehicleRecord[];
    isShared?: boolean;
}

export const VehicleStat = ({ label, children, ...props }) => (
    <Stat minW="max-content" {...props}>
        <StatLabel color="gray.500">{label}</StatLabel>
        <StatNumber fontSize={['lg', null, 'x-large']}>
            {children}
        </StatNumber>
    </Stat>
);

export const VehicleStats: React.FC<VehicleStatsProps> = ({ vehicle, records, isShared }) => {
    const [oldestRecord] = sortRecordsOldestFirst(records);

    return (
        <Box overflowY="hidden" overflowX="auto" maxW="calc(100vw - 32px)" mb={6}>
            <HStack spacing={[8, null, 5]} pb={2}>
                {vehicle.estimatedMileage && (
                    <VehicleStat label={`Estimated ${lang.mileageLabel[vehicle.distanceUnit]}`}>
                        {formatEstimatedMileage(vehicle)}
                    </VehicleStat>
                )}
                {vehicle.milesPerYear && (
                    <VehicleStat label={`Yearly ${lang.mileageLabel[vehicle.distanceUnit]}`}>
                        {formatMilesPerYear(vehicle)}
                    </VehicleStat>
                )}
                {oldestRecord && (
                    <VehicleStat label="Since">
                        {intlFormat(parseDateUTC(oldestRecord?.date), { month: 'short', year: 'numeric', day: 'numeric' })}
                    </VehicleStat>
                )}
                <VehicleStat label="VIN">
                    {vehicle.vin || (isShared ? '--' : (
                        <Link href={editVehiclePath(vehicle.id)} passHref>
                            <Text as="a" color="brand.primary">Add VIN...</Text>
                        </Link>
                    ))}
                </VehicleStat>
            </HStack>
        </Box>
    );
};

export default VehicleStats;
