import { Text, useColorModeValue } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import { formatMilesPerYear, formatEstimatedMileage, sortRecordsOldestFirst } from 'utils/vehicle';

export interface VehicleSummaryProps {
    vehicle: API.Vehicle;
    records: API.Record[];
}

export const VehicleSummary: React.FC<VehicleSummaryProps> = ({ vehicle, records }) => {
    const color = useColorModeValue('gray.800', 'brand.400');

    const [oldestRecord] = sortRecordsOldestFirst(records);

    if (!oldestRecord || !vehicle.estimatedMileage) {
        return null;
    }

    return (
        <Text color={color} fontWeight="500">
            Since
            {' '}
            <strong>{format(new Date(oldestRecord.date), 'MMMM d, yyy')}</strong>
            , you drive about
            <strong>
                {' '}
                {formatMilesPerYear(vehicle)}
                {' '}
                per year
            </strong>
            {' '}
            for an estimated
            {' '}
            <strong>{formatEstimatedMileage(vehicle)}</strong>
            .
        </Text>
    );
};

export default VehicleSummary;
