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
import createPersistedState from 'use-persisted-state';
import { authRedirect, withSession } from 'utils/session';
import LinkButton from 'components/common/LinkButton';
import { newVehiclePath } from 'utils/resources';
import EmptyState from 'components/common/EmptyState';
import OverallStats from 'components/OverallStats';
import { Sortable } from 'utils/sortable';
import { prefetch } from 'utils/queries';
import dynamic from 'next/dynamic';

const VehicleSortMenu = dynamic(
    () => import('components/VehicleSortMenu'),
);

interface VehiclesProps {
    fallback: {
        vehicles: API.Vehicle[];
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

const useSortableVehicles = createPersistedState('vehicleSortStrategyV2');

const Vehicles: React.FC<VehiclesProps> = ({ fallback }) => {
    const { vehicles } = fallback;

    const [showRetired, setShowRetired] = useState(false);

    const activeVehicles = vehicles.filter((v) => !v.retired);
    const retiredVehicles = vehicles.filter((v) => v.retired);

    // TODO: implement user prefs api
    const [sortable, setSortable] = useSortableVehicles<Sortable>(['created_at', 'asc']);

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
                <VehiclesList vehicles={retiredVehicles} sortStrategy="newest_first" />
            )}
        </Page>
    );
};

export const getServerSideProps = withSession(async ({ req }) => {
    const redirect = authRedirect(req);
    if (redirect) return redirect;

    const { data: vehicles } = await prefetch(req, vehiclesAPIPath);

    return {
        props: {
            fallback: {
                vehicles,
            },
        },
    };
});

export default Vehicles;
