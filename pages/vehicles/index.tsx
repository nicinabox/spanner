import React, { useState } from 'react';
import { Box, Button, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { createAPIRequest } from 'queries/config';
import { fetchVehicles, Vehicle } from 'queries/vehicles';
import { withSession, authRedirect } from 'utils/session';
import Page from 'components/Page';
import Header from 'components/Header';
import Logo from 'components/Logo';
import VehicleItem from 'components/VehicleItem';

interface VehiclesProps {
    vehicles: Vehicle[],
    error: string | null
}

const Vehicles: React.FC<VehiclesProps> = ({ vehicles, error }) => {
    const [showRetired, setShowRetired] = useState(false);

    const sortedVehicles = vehicles.sort((a, b) => a.position - b.position);
    const activeVehicles = sortedVehicles.filter(v => !v.retired);
    const retiredVehicles = sortedVehicles.filter(v => v.retired);

    return (
        <Page
            Header={() => (
                <Header
                    CenterComponent={<Logo height={30} />}
                />
            )}>

            <Box height={12} />

            <Heading fontSize="xl">
                Vehicles
            </Heading>
            <SimpleGrid columns={3} spacing={5} mt={3}>
                {activeVehicles.map(((vehicle) => {
                    return <VehicleItem key={vehicle.id} vehicle={vehicle} />
                }))}
            </SimpleGrid>

            <Box height={12} />

            <Button
                size="sm"
                variant="outline"
                rightIcon={showRetired ? <ChevronDownIcon /> : <ChevronRightIcon />}
                onClick={() => {
                    setShowRetired(!showRetired)
                }}
            >
                {showRetired ? 'Hide' : 'Show'} retired
            </Button>

            {showRetired && (
                <SimpleGrid columns={3} spacing={5} mt={3}>
                    {retiredVehicles.map(((vehicle) => {
                        return <VehicleItem key={vehicle.id} vehicle={vehicle} />
                    }))}
                </SimpleGrid>
            )}
        </Page>
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
