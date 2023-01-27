import { sessionOptions } from 'config/session';
import { withIronSessionSsr, withIronSessionApiRoute } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next/types';

declare module 'iron-session' {
    interface IronSessionData {
        session?: API.Session;
    }
}

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
