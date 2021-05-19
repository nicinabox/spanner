import { ArrowBackIcon } from '@chakra-ui/icons';
import {
    Container, Heading, HStack,
} from '@chakra-ui/react';
import Header from 'components/common/Header';
import VehicleForm from 'components/forms/VehicleForm';
import Page from 'components/common/Page';
import React from 'react';
import { withSession, authRedirect } from 'utils/session';
import LinkButton from 'components/common/LinkButton';

export interface NewVehiclePageProps {
}

export const NewVehiclePage: React.FC<NewVehiclePageProps> = () => (
    <Page
        Header={(
            <Header
                LeftComponent={(
                    <HStack spacing={2}>
                        <LinkButton
                            href="/vehicles"
                            leftIcon={<ArrowBackIcon />}
                            size="sm"
                            variant="solid"
                            colorScheme="gray"
                        >
                            Back
                        </LinkButton>
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
