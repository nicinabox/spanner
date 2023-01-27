import crypto from 'crypto';
import { withIronSessionSsr, withIronSessionApiRoute } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next/types';

declare module 'iron-session' {
    interface IronSessionData {
        session?: API.Session;
    }
}

if (!process.env.CLIENT_SECRET) {
    throw new Error('CLIENT_SECRET not set');
}

const password = crypto
    .createHash('sha256')
    .update(process.env.CLIENT_SECRET)
    .digest('hex');

const sessionOptions = {
    password,
    cookieName: 'session',
    ttl: 5184000, // 60 days
};

// export const withSession = (handler) => withIronSessionSsr(handler, sessionOptions);
export function withSession<
    P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
    handler: (
        context: GetServerSidePropsContext
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
    return withIronSessionSsr(handler, sessionOptions);
}

export const withAPISession = (handler: NextApiHandler) => withIronSessionApiRoute(handler, sessionOptions);

export const authRedirect = (req) => {
    const { session } = req.session;

    if (session) return undefined;

    return {
        redirect: {
            destination: '/',
            permanent: false,
        },
    };
};
