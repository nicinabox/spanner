import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Link } from '@chakra-ui/react';
import { vehiclesPath } from 'utils/resources';
import { ClientSession, signIn } from '../../src/queries/session';
import { withSession } from '../../src/utils/session';
import { createAPIRequest } from '../../src/queries/config';

interface LoginProps {
    session: ClientSession | null;
    error: string | null;
}

const Login: React.FC<LoginProps> = ({ session, error }) => {
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.replace(vehiclesPath());
        }
    }, [session]);

    if (error) {
        return (
            <Container>
                <p>{error}</p>
                <Link href="/">Sign in again</Link>
            </Container>
        );
    }

    return <p>Signing in...</p>;
};

export const getServerSideProps = withSession(async ({ req, res, params }) => {
    let session: ClientSession | null = null;
    let error: string | null = null;

    const api = createAPIRequest(req);

    try {
        const { data } = await signIn(api, params.loginToken);

        req.session.set('session', data);
        await req.session.save();

        const { authToken, ...clientSession } = data;
        session = clientSession;
    } catch (err) {
        error = err.response?.data?.error ?? err.toString();
    }

    return {
        props: {
            session,
            error,
        },
    };
});

export default Login;
