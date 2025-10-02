import { Box, HStack } from '@chakra-ui/react';
import usePageContext from 'hooks/usePageContext';
import React from 'react';
import { sortRecordsOldestFirst } from 'utils/vehicle';
import * as AllVehicleStats from './VehicleStat';

export interface VehicleStatsProps {
    vehicle: API.Vehicle;
    records: API.Record[];
}

const ENABLED_STATS = [
    'EstimatedMileageStat',
    'YearlyMileageStat',
    'SinceStat',
    'VinStat',
];

export const VehicleStats: React.FC<VehicleStatsProps> = ({
    vehicle,
    records,
}) => {
    const { isShared } = usePageContext();
    const [oldestRecord] = sortRecordsOldestFirst(records);

    return (
        <Box
            overflowY="hidden"
            overflowX="auto"
            maxW="calc(100vw - 32px)"
            mb={6}
            sx={{
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
            }}
        >
            <HStack spacing={[8, null, 8]} pb={2}>
                {ENABLED_STATS.map((name) => {
                    const VehicleStat = AllVehicleStats[name];
                    const props = {
                        vehicle,
                        records,
                        oldestRecord,
                        isShared,
                    };
                    return <VehicleStat key={name} {...props} />;
                })}
            </HStack>
        </Box>
    );
};

export default VehicleStats;
