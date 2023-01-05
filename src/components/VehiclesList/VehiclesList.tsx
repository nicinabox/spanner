import { SimpleGrid, Skeleton } from '@chakra-ui/react';
import VehicleItem from 'components/VehicleItem';
import React from 'react';
import { vehicleSortStrategy, Sortable } from 'utils/sortable';

export interface VehiclesListProps {
    vehicles: API.Vehicle[] | undefined;
    loading?: boolean;
    sortable?: Sortable;
}

export const VehiclesList: React.FC<VehiclesListProps> = ({
    vehicles, sortable = [], loading = false,
}) => {
    const [sortStrategy, sortOrder] = sortable;
    const sortedVehicles = sortStrategy && sortOrder && vehicles
        ? vehicleSortStrategy[sortStrategy](vehicles, sortOrder)
        : vehicles ?? [];

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
