import { Box, Button, Center, Heading } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { vehiclesPath } from 'utils/resources';
import { prefetch } from 'utils/queries';
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
    const { data, error } = await prefetch(req, (api) => {
        return signIn(api, params?.loginToken as string);
    });

    if (data) {
        req.session.session = data;
        await req.session.save();

        return {
            redirect: {
                destination: vehiclesPath(),
                permanent: false,
            },
        };
    }

    return {
        props: {
            error,
        },
    };
});

export default Login;
