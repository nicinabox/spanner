import { Box, HStack } from '@chakra-ui/react';
import { Stat } from 'components/VehicleStats/VehicleStat';
import { groupBy } from 'lodash';
import React from 'react';
import { formatMileage } from 'utils/vehicle';

export interface OverallStatsProps {
    activeVehicles: API.Vehicle[];
}

// TODO:
// - overall stats by distance unit
// - count of active vehicles
export const OverallStats: React.FC<OverallStatsProps> = ({ activeVehicles }) => {
    const vehiclesByDistanceUnit = groupBy(activeVehicles, 'distanceUnit');

    return (
        <Box overflowY="hidden" overflowX="auto" maxW="calc(100vw - 32px)">
            <HStack spacing={12}>
                <Stat label="Active vehicles" flex={0}>
                    {activeVehicles.length}
                </Stat>

                {Object.keys(vehiclesByDistanceUnit).map((distanceUnit: API.DistanceUnit) => {
                    const total = vehiclesByDistanceUnit[distanceUnit].reduce((acc, vehicle) => {
                        return acc + (vehicle.milesPerYear ?? 0);
                    }, 0);

                    return (
                        <Stat key={distanceUnit} label={`Total ${distanceUnit} per year`} flex={0}>
                            {formatMileage(total, distanceUnit)}
                        </Stat>
                    );
                })}
            </HStack>
        </Box>
    );
};

export default OverallStats;
