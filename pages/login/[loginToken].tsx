import {
    Box, Button, Center, Heading, Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { vehiclesPath } from 'utils/resources';
import { createAPIRequest } from 'queries/config';
import { signIn } from 'queries/session';
import { withSession } from 'utils/session';

interface LoginProps {
    error: string | null;
}

const Login: React.FC<LoginProps> = ({ error }) => {
    if (error) {
        return (
            <Center height="100vh" flexDirection="column" textAlign="center">
                <Box mb={6}>
                    <Heading size="md">{error}</Heading>
                </Box>

                <Link href="/" passHref>
                    <Button as="a" colorScheme="brand">
                        Sign in again
                    </Button>
                </Link>
            </Center>
        );
    }

    return <p>Signing in...</p>;
};

export const getServerSideProps = withSession(async ({ req, res, params }) => {
    let error: string | null = null;

    const api = createAPIRequest(req);

    try {
        const { data } = await signIn(api, params.loginToken);

        req.session.set('session', data);
        await req.session.save();

        return {
            redirect: {
                destination: vehiclesPath(),
                permanent: false,
            },
        };
    } catch (err) {
        error = err.response?.data?.error ?? err.toString();
    }

    return {
        props: {
            error,
        },
    };
});

export default Login;
