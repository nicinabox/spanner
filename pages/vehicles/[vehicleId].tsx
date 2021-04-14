import React from 'react';

interface VehicleProps {
    vehicleId: string;
}

const Vehicle: React.FC<VehicleProps> = ({ vehicleId }) => {
    return (
        <div>
            Vehicle {vehicleId}
        </div>
    )
}

export async function getServerSideProps({ params }) {
    const { vehicleId } = params;

    return {
        props: {
            vehicleId
        }
    }
}

export default Vehicle;