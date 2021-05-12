import { ArrowBackIcon } from '@chakra-ui/icons';
import {
    Button, Container, Heading, HStack,
} from '@chakra-ui/react';
import Header from 'components/Header';
import VehicleForm from 'components/VehicleForm';
import Page from 'components/Page';
import Link from 'next/link';
import React from 'react';
import { withSession, authRedirect } from 'utils/session';

export interface NewVehiclePageProps {
}

export const NewVehiclePage: React.FC<NewVehiclePageProps> = () => (
    <Page
        Header={(
            <Header
                LeftComponent={(
                    <HStack spacing={2}>
                        <Link href="/vehicles" passHref>
                            <Button
                                as="a"
                                leftIcon={<ArrowBackIcon />}
                                size="sm"
                                variant="solid"
                                colorScheme="gray"
                            >
                                Back
                            </Button>
                        </Link>
                    </HStack>
                      )}
            />
              )}
    >
        <Container maxW={[null, 'md']} p={0}>
            <Heading mb={6}>
                New Vehicle
            </Heading>
            <VehicleForm />
        </Container>
    </Page>
);

export const getServerSideProps = withSession(async ({ req }) => {
    const redirect = authRedirect(req);
    if (redirect) return redirect;
    return {
        props: {},
    };
});

export default NewVehiclePage;
