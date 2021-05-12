import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons';
import {
    Box, Button, Container, Flex, Heading, HStack, Spacer, TabPanel, TabPanels, Text,
} from '@chakra-ui/react';
import BackButton from 'components/BackButton';
import LinkPreload from 'components/LinkPreload';
import Page from 'components/Page';
import Search from 'components/Search';
import TabsHeader from 'components/TabsHeader';
import VehicleActionsMenu from 'components/VehicleActionsMenu';
import VehicleNotes from 'components/VehicleNotes';
import VehicleRecordsTable, { SkeletonVehicleRecordsTable } from 'components/VehicleRecordsTable';
import { intlFormat } from 'date-fns';
import useRequest from 'hooks/useRequest';
import Link from 'next/link';
import { VehicleRecord, vehicleRecordsPath } from 'queries/records';
import { Vehicle, vehiclePath } from 'queries/vehicles';
import React, { useEffect, useState } from 'react';
import { parseDateISO } from 'utils/date';
import { authRedirect, withSession } from 'utils/session';

export interface VehiclePageProps {
    params: {
        vehicleId: string;
    }
}

const PageHeader = ({ vehicle }) => (
    <TabsHeader
        columns={[1, 3]}
        tabs={['Service', 'Notes']}
        LeftComponent={(
            <HStack spacing={2}>
                <BackButton href="/">
                    Vehicles
                </BackButton>

                <VehicleActionsMenu vehicle={vehicle} />
            </HStack>
            )}
    />
);

const VehiclePage: React.FC<VehiclePageProps> = ({ params }) => {
    const { data: vehicle, loading: vehicleLoading } = useRequest<Vehicle>(vehiclePath(params.vehicleId));
    const { data: records, loading: recordsLoading } = useRequest<VehicleRecord[]>(vehicleRecordsPath(params.vehicleId));

    const anyLoading = vehicleLoading || recordsLoading;

    const [recordsResults, setRecordsResults] = useState(records ?? []);

    useEffect(() => {
        if (records && !recordsLoading && !recordsResults.length) {
            setRecordsResults(records);
        }
    }, [records, recordsLoading]);

    const handleSearch = (text: string) => {
        if (!text) {
            setRecordsResults(records ?? []);
            return;
        }

        const re = new RegExp(text, 'gi');
        const nextResults = (records || []).filter((v) => {
            const date = intlFormat(parseDateISO(v.date), { month: 'short', year: 'numeric', day: 'numeric' });

            return re.test(v.notes) || re.test(date);
        });
        setRecordsResults(nextResults);
    };

    return (
        <Page
            p={0}
            Header={<PageHeader vehicle={vehicle} />}
        >
            <LinkPreload path={[
                vehiclePath(params.vehicleId),
                vehicleRecordsPath(params.vehicleId),
            ]}
            />

            <TabPanels>
                <TabPanel px={0}>
                    <Container maxW="container.xl">
                        <Flex mb={6}>
                            <HStack spacing={6}>
                                <Link href={`/vehicles/${vehicle?.id}/add`} passHref>
                                    <Button as="a" colorScheme="brand" size="sm" leftIcon={<AddIcon />}>
                                        Add...
                                    </Button>
                                </Link>
                            </HStack>
                            <Spacer minW={[6, null]} />
                            <Search onChangeText={handleSearch} />
                        </Flex>

                        {anyLoading && (
                            <Box shadow="lg" p={4}>
                                <SkeletonVehicleRecordsTable />
                            </Box>
                        )}

                        {vehicle && Boolean(recordsResults?.length) && (
                            <Box shadow="lg" p={4}>
                                <VehicleRecordsTable records={recordsResults} enableCost={vehicle.enableCost} distanceUnit={vehicle.distanceUnit} />
                            </Box>
                        )}

                        {!anyLoading && vehicle && Boolean(!records?.length) && (
                            <Box>
                                <Heading>
                                    You don&apos;t have any records yet
                                </Heading>
                                <Text>Try adding your purchase as the first one</Text>
                            </Box>
                        )}

                        {records && Boolean(!recordsResults?.length) && (
                            <Box>
                                <Heading>
                                    No results
                                </Heading>
                                <Text>Try searching a date or note</Text>
                            </Box>
                        )}
                    </Container>
                </TabPanel>
                <TabPanel px={0}>
                    {vehicle && (
                        <VehicleNotes vehicle={vehicle} />
                    )}
                </TabPanel>
            </TabPanels>
        </Page>
    );
};

export const getServerSideProps = withSession(async ({ req, params }) => {
    const redirect = authRedirect(req);
    if (redirect) return redirect;

    return {
        props: {
            params,
        },
    };
});

export default VehiclePage;
