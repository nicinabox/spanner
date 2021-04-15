import Cookies from 'cookies';
import crypto from 'crypto';
import { withIronSession } from "next-iron-session";
import { Session } from '../queries/session';

const hashedSecret = crypto
    .createHash("sha256")
    .update(process.env.CLIENT_SECRET)
    .digest("hex");

export const withSession = (handler) => {
    return withIronSession(handler, {
        password: hashedSecret,
        cookieName: 'session',
        cookieOptions: {
            secure: process.env.NODE_ENV !== 'development',
        },
    });
}

export const authRedirect = (req) => {
    const session = req.session.get('session');

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
}