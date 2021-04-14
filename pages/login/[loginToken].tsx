import React, { useEffect } from 'react';
import { useRouter } from 'next/router'
import { Session, signIn } from '../../queries/session';

interface LoginProps {
    session: Session;
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
            <p>{error}</p>
        )
    }

    return <p>Signing in...</p>
}

export async function getServerSideProps({ params }) {
    const { loginToken } = params;

    let session;
    let error;

    try { 
        session = await signIn(loginToken);
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