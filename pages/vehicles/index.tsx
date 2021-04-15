import React from 'react';
import { withSession, authRedirect } from '../../src/utils/session';

interface VehiclesProps {
    vehicles: []
}

const Vehicles: React.FC<VehiclesProps> = ({ vehicles }) => {
    return (
        <div>
            Vehicles
        </div>
    )
}

export const getServerSideProps = withSession(async function ({ req, params }) {
    const redirect = authRedirect(req)
    if (redirect) return redirect;

    return {
        props: {
            vehicles: []
        }
    }
})

export default Vehicles;