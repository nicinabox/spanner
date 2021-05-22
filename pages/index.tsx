import { Container } from '@chakra-ui/react';
import React from 'react';
import { vehiclesPath } from 'utils/resources';
import LoginForm from '../src/components/forms/LoginForm';
import { withSession } from '../src/utils/session';

export default function Home() {
    return (
        <Container>
            <LoginForm />
        </Container>
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
