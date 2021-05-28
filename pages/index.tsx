import { Center, Container } from '@chakra-ui/react';
import React from 'react';
import { vehiclesPath } from 'utils/resources';
import { withSession } from 'utils/session';
import LoginForm from 'components/forms/LoginForm';
import Header from 'components/common/Header';
import Logo from 'components/Logo';

export default function Home() {
    return (
        <>
            <Header
                py={2}
                CenterComponent={(
                    <Center flex={1}>
                        <Logo height={30} />
                    </Center>
                  )}
            />
            <Container>
                <LoginForm />
            </Container>
        </>
    );
}

export const getServerSideProps = withSession(async ({ req }) => {
    const session = req.session.get('session');

    if (session) {
        return {
            redirect: {
                destination: vehiclesPath(),
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
});
