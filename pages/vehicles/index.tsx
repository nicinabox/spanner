import { AddIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
    Box, Button, Center, Flex, Heading, HStack, SimpleGrid, useBreakpointValue,
} from '@chakra-ui/react';
import ColorModeButton from 'components/common/ColorModeButton';
import Header from 'components/common/Header';
import Logo from 'components/Logo';
import Page from 'components/common/Page';
import UserMenu from 'components/UserMenu';
import VehiclesList from 'components/VehiclesList';
import { vehiclesAPIPath } from 'queries/vehicles';
import React, { useState } from 'react';
import { authRedirect, withSession } from 'utils/session';
import LinkButton from 'components/common/LinkButton';
import { newVehiclePath } from 'utils/resources';
import EmptyState from 'components/common/EmptyState';
import OverallStats from 'components/OverallStats';
import { prefetch } from 'utils/queries';
import dynamic from 'next/dynamic';
import { userAPIPath } from 'queries/user';
import useRequest, { update } from 'hooks/useRequest';

const VehicleSortMenu = dynamic(
    () => import('components/VehicleSortMenu'),
);

interface VehiclesProps {
    fallback: {
        [vehiclesAPIPath]: API.Vehicle[];
        [userAPIPath]: API.User;
    }
}

const PageHeader = () => {
    return (
        <Header>
            <SimpleGrid columns={3} py={2}>
                <Box />
                <Center>
                    <Logo height={30} />
                </Center>
                <Flex justify="end">
                    <HStack spacing={4}>
                        <ColorModeButton />
                        <UserMenu />
                    </HStack>
                </Flex>
            </SimpleGrid>
        </Header>
    );
};

const Vehicles: React.FC<VehiclesProps> = ({ fallback }) => {
    const { mutate, data: user } = useRequest<API.User>(userAPIPath, { fallback });
    const { data: vehicles = [] } = useRequest<API.Vehicle[]>(vehiclesAPIPath, {
        fallback,
    });

    const [showRetired, setShowRetired] = useState(false);

    const activeVehicles = vehicles.filter((v) => !v.retired);
    const retiredVehicles = vehicles.filter((v) => v.retired);

    const sortable = user?.preferences.vehiclesSortOrder ?? ['created_at', 'desc'];

    const setSortable = async (vehiclesSortOrder: API.Sortable) => {
        if (!user) return;

        const data = {
            preferences: {
                vehiclesSortOrder,
            },
        };

        const res = await update(userAPIPath, data);
        mutate(res, { revalidate: false });
    };

    const newVehicleButtonSize = useBreakpointValue({ sm: 'xs', base: 'sm' });

    return (
        <Page
            fallback={fallback}
            maxW="container.xl"
            Header={<PageHeader />}
        >
            <Box my={6}>
                <OverallStats activeVehicles={activeVehicles} />
            </Box>

            <Flex direction={['column', 'row']} align={[null, 'center']}>
                <Flex flex={1} justify="space-between" align="center" mb={[2, 0]} mr={[0, 2]}>
                    <Heading fontSize="xl">
                        Vehicles
                    </Heading>
                    <LinkButton href={newVehiclePath()} leftIcon={<AddIcon />} size={newVehicleButtonSize} variant="ghost">
                        New Vehicle
                    </LinkButton>
                </Flex>
                <VehicleSortMenu sortable={sortable} onChange={setSortable} />
            </Flex>

            <VehiclesList vehicles={activeVehicles} sortable={sortable} />

            {!activeVehicles.length && (
                <EmptyState
                    heading="Add your first vehicle to get started"
                    action={(
                        <LinkButton href={newVehiclePath()} leftIcon={<AddIcon />} shadow="lg">
                            New Vehicle
                        </LinkButton>
                      )}
                />
            )}

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
                <VehiclesList vehicles={retiredVehicles} sortable={['created_at', 'desc']} />
            )}
        </Page>
    );
};

export const getServerSideProps = withSession(async ({ req }) => {
    const redirect = authRedirect(req);
    if (redirect) return redirect;

    const { data: user = null } = await prefetch(req, userAPIPath);
    const { data: vehicles = null } = await prefetch(req, vehiclesAPIPath);

    return {
        props: {
            fallback: {
                [vehiclesAPIPath]: vehicles,
                [userAPIPath]: user,
            },
        },
    };
});

export default Vehicles;
