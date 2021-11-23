import { AddIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
    Box, Button, Center, Flex, Heading, HStack, SimpleGrid, Text, useBreakpointValue,
} from '@chakra-ui/react';
import ColorModeButton from 'components/common/ColorModeButton';
import Header from 'components/common/Header';
import LinkPreload from 'components/common/LinkPreload';
import Logo from 'components/Logo';
import Page from 'components/common/Page';
import UserMenu from 'components/UserMenu';
import VehiclesList from 'components/VehiclesList';
import useRequest from 'hooks/useRequest';
import { Vehicle, vehiclesAPIPath } from 'queries/vehicles';
import React, { useState } from 'react';
import createPersistedState from 'use-persisted-state';
import { authRedirect, withSession } from 'utils/session';
import LinkButton from 'components/common/LinkButton';
import { newVehiclePath } from 'utils/resources';
import EmptyState from 'components/common/EmptyState';
import OverallStats from 'components/OverallStats';
import { VehicleSortStrategy } from 'utils/sortable';
import dynamic from 'next/dynamic';

const VehicleSortMenu = dynamic(
    () => import('components/VehicleSortMenu'),
    { ssr: false },
);

interface VehiclesProps {
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

const useSortStrategyState = createPersistedState('vehicleSortStrategy');

const Vehicles: React.FC<VehiclesProps> = () => {
    const { data, loading } = useRequest<Vehicle[]>(vehiclesAPIPath);

    const [showRetired, setShowRetired] = useState(false);

    const activeVehicles = data?.filter((v) => !v.retired) ?? [];
    const retiredVehicles = data?.filter((v) => v.retired) ?? [];

    const [sortStrategy, setSortStrategy] = useSortStrategyState<VehicleSortStrategy>('newest_first');

    const newVehicleButtonSize = useBreakpointValue({ sm: 'xs', base: 'sm' });

    return (
        <Page
            maxW="container.xl"
            Header={<PageHeader />}
        >
            <LinkPreload path={vehiclesAPIPath} />

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
                <VehicleSortMenu sortStrategy={sortStrategy} onChange={setSortStrategy} />
            </Flex>

            <VehiclesList vehicles={activeVehicles} loading={loading} sortStrategy={sortStrategy} />

            {!activeVehicles.length && !loading && (
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

    return {
        props: {},
    };
});

export default Vehicles;
