import { AddIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
    Box, Button, Heading, HStack, SimpleGrid, Skeleton,
} from '@chakra-ui/react';
import Header from 'components/Header';
import LinkPreload from 'components/LinkPreload';
import Logo from 'components/Logo';
import Page from 'components/Page';
import VehicleItem from 'components/VehicleItem';
import useRequest from 'hooks/useRequest';
import Head from 'next/head';
import Link from 'next/link';
import { Vehicle, vehiclesPath } from 'queries/vehicles';
import React, { useState } from 'react';
import { authRedirect, withSession } from 'utils/session';

interface VehiclesProps {
}

const Vehicles: React.FC<VehiclesProps> = () => {
    const { data } = useRequest<Vehicle[]>(vehiclesPath);

    const [showRetired, setShowRetired] = useState(false);

    const sortedVehicles = data?.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) || [];
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
            <LinkPreload path={vehiclesPath} />

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
                {!activeVehicles.length && [1,2].map(() => (
                    <Skeleton height="80px" />
                ))}
                {activeVehicles.map(((vehicle) => <VehicleItem key={vehicle.id} vehicle={vehicle} />))}
            </SimpleGrid>

            <Box height={12} />

            {Boolean(retiredVehicles.length) && (
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
            )}

            {showRetired && (
                <SimpleGrid columns={3} spacing={5} mt={3}>
                    {retiredVehicles.map(((vehicle) => <VehicleItem key={vehicle.id} vehicle={vehicle} />))}
                </SimpleGrid>
            )}
        </Page>
    );
};

export const getServerSideProps = withSession(async ({ req }) => {
    const redirect = authRedirect(req);
    if (redirect) return redirect;

    return {
        props: {}
    }
});

export default Vehicles;
