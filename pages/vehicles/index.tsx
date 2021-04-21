import React from 'react';
import { createAPIRequest } from '../../src/queries/config';
import { fetchVehicles, Vehicle } from '../../src/queries/vehicles';
import { withSession, authRedirect } from '../../src/utils/session';

interface VehiclesProps {
    vehicles: Vehicle[],
    error: string | null
}

const Vehicles: React.FC<VehiclesProps> = ({ vehicles, error }) => {
    console.log(vehicles)

    return (
        <div>
            Vehicles
        </div>
    )
}

export const getServerSideProps = withSession(async function ({ req, params }) {
    const redirect = authRedirect(req)
    if (redirect) return redirect;

    let vehicles: Vehicle[] = [];
    let error: string | null = null;

    const api = createAPIRequest(req)

    try {
        const { data } = await fetchVehicles(api)
        vehicles = data;
    } catch (err) {
        error = err.data.error;
    }

    return {
        props: {
            vehicles,
            error,
        }
    }
})

export default Vehicles;
