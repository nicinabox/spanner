import { AddIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
    Box, Button, Heading, HStack, SimpleGrid,
} from '@chakra-ui/react';
import Header from 'components/Header';
import Logo from 'components/Logo';
import Page from 'components/Page';
import VehicleItem from 'components/VehicleItem';
import Link from 'next/link';
import { fetchVehicles, Vehicle } from 'queries/vehicles';
import React, { useState } from 'react';
import { fetchInitialData } from 'utils/queries';
import { authRedirect, withSession } from 'utils/session';

interface VehiclesProps {
    data?: Vehicle[];
    error?: string;
}

const Vehicles: React.FC<VehiclesProps> = ({ data, error }) => {
    const [showRetired, setShowRetired] = useState(false);

    const sortedVehicles = data?.sort((a, b) => a.position - b.position);
    const activeVehicles = sortedVehicles.filter((v) => !v.retired);
    const retiredVehicles = sortedVehicles.filter((v) => v.retired);

    return (
        <Page
            maxW="container.xl"
            Header={(
                <Header
                    CenterComponent={<Logo height={30} />}
                />
              )}
        >

            <Box height={12} />

            <HStack spacing={4}>
                <Heading fontSize="xl">
                    Vehicles
                </Heading>
                <Link href="/vehicles/new" passHref>
                    <Button as="a" leftIcon={<AddIcon />} size="xs" variant="ghost" colorScheme="brand">
                        New Vehicle
                    </Button>
                </Link>
            </HStack>

            <SimpleGrid columns={3} spacing={5} mt={3}>
                {activeVehicles.map(((vehicle) => <VehicleItem key={vehicle.id} vehicle={vehicle} />))}
            </SimpleGrid>

            <Box height={12} />

            <Button
                size="sm"
                variant="outline"
                rightIcon={showRetired ? <ChevronDownIcon /> : <ChevronRightIcon />}
                onClick={() => {
                    setShowRetired(!showRetired);
                }}
            >
                {showRetired ? 'Hide' : 'Show'}
                {' '}
                retired
            </Button>

            {showRetired && (
                <SimpleGrid columns={3} spacing={5} mt={3}>
                    {retiredVehicles.map(((vehicle) => <VehicleItem key={vehicle.id} vehicle={vehicle} />))}
                </SimpleGrid>
            )}
        </Page>
    );
};

export const getServerSideProps = withSession(async ({ req, params }) => {
    const redirect = authRedirect(req);
    if (redirect) return redirect;

    const initialData = await fetchInitialData(req, fetchVehicles);

    return {
        props: initialData,
    };
});

export default Vehicles;
