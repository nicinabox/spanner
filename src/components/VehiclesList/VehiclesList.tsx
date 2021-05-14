import { SimpleGrid, Skeleton } from '@chakra-ui/react';
import VehicleItem from 'components/VehicleItem';
import { Vehicle } from 'queries/vehicles';
import React from 'react';

export interface VehiclesListProps {
    vehicles: Vehicle[] | undefined;
}

export const VehiclesList: React.FC<VehiclesListProps> = ({ vehicles }) => {
    return (
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={5} mt={3}>
            {!vehicles?.length && [1, 2].map((n) => (
                <Skeleton key={n} height="80px" />
            ))}

            {vehicles?.map(((vehicle) => <VehicleItem key={vehicle.id} vehicle={vehicle} />))}
        </SimpleGrid>
    );
};

export default VehiclesList;
