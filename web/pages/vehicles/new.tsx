import { Container, Heading, HStack } from '@chakra-ui/react';
import Header from 'components/common/Header';
import VehicleForm from 'components/forms/VehicleForm';
import Page from 'components/common/Page';
import React from 'react';
import { withSession, authRedirect } from 'utils/session';
import BackButton from 'components/common/BackButton';

export const NewVehiclePage: React.FC = () => (
    <Page
        Header={
            <Header
                LeftComponent={
                    <HStack spacing={2}>
                        <BackButton>Back</BackButton>
                    </HStack>
                }
            />
        }
    >
        <Container maxW={[null, 'md']} p={0}>
            <Heading mb={6}>New Vehicle</Heading>
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
