import { Box, HStack } from '@chakra-ui/react';
import { VehicleStat } from 'components/VehicleStats';
import { groupBy } from 'lodash';
import { DistanceUnit, Vehicle } from 'queries/vehicles';
import React from 'react';
import { formatMileage } from 'utils/vehicle';

export interface OverallStatsProps {
    activeVehicles: Vehicle[];
}

// TODO:
// - overall stats by distance unit
// - count of active vehicles
export const OverallStats: React.FC<OverallStatsProps> = ({ activeVehicles }) => {
    const vehiclesByDistanceUnit = groupBy(activeVehicles, 'distanceUnit');

    return (
        <Box overflowY="hidden" overflowX="auto" maxW="calc(100vw - 32px)">
            <HStack spacing={12}>
                <VehicleStat label="Active vehicles" flex={0}>
                    {activeVehicles.length}
                </VehicleStat>

                {Object.keys(vehiclesByDistanceUnit).map((distanceUnit: DistanceUnit) => {
                    const total = vehiclesByDistanceUnit[distanceUnit].reduce((acc, vehicle) => {
                        return acc + (vehicle.milesPerYear ?? 0);
                    }, 0);

                    return (
                        <VehicleStat key={distanceUnit} label={`Total ${distanceUnit} per year`} flex={0}>
                            {formatMileage(total, distanceUnit)}
                        </VehicleStat>
                    );
                })}
            </HStack>
        </Box>
    );
};

export default OverallStats;
