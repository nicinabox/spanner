import { Text, useColorModeValue } from '@chakra-ui/react';
import { format } from 'date-fns';
import { Vehicle, VehicleRecord } from 'queries/vehicles';
import React from 'react';
import { formatMilesPerYear, formatEstimatedMileage } from 'utils/vehicle';

export interface VehicleSummaryProps {
    vehicle: Vehicle;
    records: VehicleRecord[];
}

export const VehicleSummary: React.FC<VehicleSummaryProps> = ({ vehicle, records }) => {
    const color = useColorModeValue('gray.800', 'brand.400');

    const [firstRecord] = records;

    if (!firstRecord) {
        return null;
    }

    return (
        <Text color={color} fontWeight="500">
            Since <strong>{format(new Date(firstRecord.date), 'MMMM d, yyy')}</strong>, you drive about <strong>{formatMilesPerYear(vehicle)} per year</strong> for an estimated <strong>{formatEstimatedMileage(vehicle)}</strong>.
        </Text>
    );
};

export default VehicleSummary;
