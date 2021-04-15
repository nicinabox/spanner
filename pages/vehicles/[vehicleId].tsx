import React from 'react';
import { authRedirect, withSession } from '../../src/utils/session';

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
    const redirect = authRedirect(req)
    if (redirect) return redirect;

    const { vehicleId } = params;

    return {
        props: {
            vehicleId
        }
    }
})

export default Vehicle;