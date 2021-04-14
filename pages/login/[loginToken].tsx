import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'cookies'
import { ClientSession, Session, signIn } from '../../src/queries/session'

interface LoginProps {
    session: ClientSession;
    error: string | undefined;
}

const Login: React.FC<LoginProps> = ({ session, error }) => {
    const router = useRouter()

    useEffect(() => {
        if (session) {
            // TODO: persist the session for reference
            router.replace('/vehicles');
        }
    }, [session])

    if (error) {
        return (
            <p>{error}</p>
        )
    }

    return <p>Signing in...</p>
}

export async function getServerSideProps({ req, res, params }) {
    const { loginToken } = params;

    const cookies = new Cookies(req, res)

    let session: ClientSession | undefined;
    let error: Error | undefined;

    try {
        const { data } = await signIn(loginToken)
        const { authToken, ...clientSession } = data
        session = clientSession

        cookies.set('auth-token', authToken, {
            httpOnly: true
        })

    } catch (err) {
        error = err;
    }

    return {
        props: {
            session,
            error,
        }
    }
}

export default Login;