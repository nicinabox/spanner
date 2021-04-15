import React from 'react';
import { withSession } from '../../src/utils/session';

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

export const getServerSideProps = withSession(async function ({ req, params }) {
    const { session } = req.session

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const { vehicleId } = params;

    return {
        props: {
            vehicleId
        }
    }
})

export default Vehicle;