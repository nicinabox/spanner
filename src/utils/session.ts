import Cookies from 'cookies';
import crypto from 'crypto';
import { Session } from '../queries/session';

export const getSessionCookieName = () => {
    const hashedSecret = crypto
        .createHash("sha256")
        .update(process.env.CLIENT_SECRET)
        .digest("hex");

    return `session-${hashedSecret}`;
}

export const getSessionCookie = (cookies: Cookies): Session | undefined => {
    try {
        return JSON.parse(cookies.get(getSessionCookieName()));
    } catch (err) {
        return undefined;
    }
}

export const withSession = (handler) => (props) => {
    const { req, res } = props;

    const cookies = new Cookies(req, res);
    req.session = {
        session: getSessionCookie(cookies)
    }

    return handler(props);
}