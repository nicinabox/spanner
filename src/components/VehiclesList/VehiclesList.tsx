import { SimpleGrid, Skeleton } from '@chakra-ui/react';
import VehicleItem from 'components/VehicleItem';
import { Vehicle } from 'queries/vehicles';
import React from 'react';
import { vehicleSortStrategy, VehicleSortStrategy } from 'utils/sortable';

export interface VehiclesListProps {
    vehicles: Vehicle[] | undefined;
    loading?: boolean;
    sortStrategy?: VehicleSortStrategy;
}

export const VehiclesList: React.FC<VehiclesListProps> = ({
    vehicles, sortStrategy, loading = false,
}) => {
    const sortedVehicles = sortStrategy && vehicles ? vehicleSortStrategy[sortStrategy](vehicles) : vehicles ?? [];

    return (
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={5} mt={3}>
            {loading && [1, 2].map((n) => (
                <Skeleton key={n} height="80px" />
            ))}

            {sortedVehicles.map(((vehicle) => <VehicleItem key={vehicle.id} vehicle={vehicle} />))}
        </SimpleGrid>
    );
};

export default VehiclesList;
