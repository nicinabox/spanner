import { AddIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
    Badge,
    Box, Button, Center, Heading, HStack, SimpleGrid, Skeleton,
} from '@chakra-ui/react';
import ColorModeButton from 'components/ColorModeButton';
import Header from 'components/Header';
import LinkPreload from 'components/LinkPreload';
import Logo from 'components/Logo';
import Page from 'components/Page';
import UserMenu from 'components/UserMenu';
import VehicleItem from 'components/VehicleItem';
import VehiclesList from 'components/VehiclesList';
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
                    LeftComponent={<Box />}
                    CenterComponent={(
                        <Center>
                            <Logo height={30} />

                        </Center>
                      )}
                    RightComponent={(
                        <HStack spacing={2}>
                            <ColorModeButton />
                            <UserMenu />
                        </HStack>
                  )}
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

            <VehiclesList vehicles={activeVehicles} />

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
                <VehiclesList vehicles={retiredVehicles} />
            )}
        </Page>
    );
};

export const getServerSideProps = withSession(async ({ req }) => {
    const redirect = authRedirect(req);
    if (redirect) return redirect;

    return {
        props: {},
    };
});

export default Vehicles;
