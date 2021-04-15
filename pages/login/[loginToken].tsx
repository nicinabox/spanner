import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'cookies'
import { ClientSession, Session, signIn } from '../../src/queries/session'
import { getSessionCookieName } from '../../src/utils/session'
import { Container, Link } from '@chakra-ui/react'

interface LoginProps {
    session: ClientSession;
    error: string | undefined;
}

const Login: React.FC<LoginProps> = ({ session, error }) => {
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.replace('/vehicles');
        }
    }, [session])

    if (error) {
        return (
            <Container>
                <p>{error}</p>
                <Link href="/">Sign in again</Link>
            </Container>
        )
    }

    return <p>Signing in...</p>
}

export async function getServerSideProps({ req, res, params }) {
    const { loginToken } = params;

    const cookies = new Cookies(req, res)

    let session: ClientSession | null = null;
    let error: string | null = null;

    try {
        const { data } = await signIn(loginToken)
        session = data

        cookies.set(getSessionCookieName(), JSON.stringify(session), {
            httpOnly: true
        })

    } catch (err) {
        error = err.response.data.error;
    }

    return {
        props: {
            session,
            error,
        }
    }
}

export default Login;