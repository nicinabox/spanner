import { Button, Flex, Heading, HStack, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Header from 'components/Header';
import Page from 'components/Page';
import Search from 'components/Search';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import Link from 'next/link';
import { createAPIRequest } from 'queries/config';
import { fetchVehicle, Vehicle } from 'queries/vehicles';
import React from 'react';
import { authRedirect, withSession } from '../../src/utils/session';

interface VehiclePageProps {
    vehicle: Vehicle;
}

const VehiclePage: React.FC<VehiclePageProps> = ({ vehicle }) => {
    return (
        <Page Header={() => (
            <Header
                LeftComponent={
                    <HStack spacing={2}>
                        <Link href="/" passHref>
                            <Button
                                as="a"
                                leftIcon={<ArrowBackIcon />}
                                size="sm"
                                variant="solid"
                                colorScheme="gray"
                            >
                                Vehicles
                            </Button>
                        </Link>
                        <VehicleActionsMenu vehicle={vehicle} />
                    </HStack>
                }
                CenterComponent={<Search />}
            />
        )}>
            <Heading>
                {vehicle.name}
            </Heading>
        </Page>
    )
}

export const getServerSideProps = withSession(async function ({ req, params }) {
    const redirect = authRedirect(req)
    if (redirect) return redirect;

    const { vehicleId } = params;

    try {
        const { data } = await fetchVehicle(createAPIRequest(req), vehicleId);
        return {
            props: {
                vehicle: data,
            },
        };
    } catch(err) {
        return {
            props: {
                error: err.data.error
            }
        }
    }
})

export default VehiclePage;
