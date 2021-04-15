import { Container } from '@chakra-ui/react'
import React from 'react'
import LoginForm from '../src/components/LoginForm'
import { withSession } from '../src/utils/session';

export default function Home() {
    return (
        <Container>
            <LoginForm />
        </Container>
    )
}

export const getServerSideProps = withSession(async function ({ req }) {
    const session = req.session.get('session');

    if (session) {
        return {
            redirect: {
                destination: '/vehicles',
                permanent: false,
            },
        }
    }

    return {
        props: {}
    };
});