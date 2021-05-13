import httpProxyMiddleware from 'next-http-proxy-middleware';
import { Session } from 'queries/session';
import { withSession } from 'utils/session';

// eslint-disable-next-line prefer-destructuring
const PROXY_HOST = process.env.PROXY_HOST;

if (!PROXY_HOST) {
    throw new Error('PROXY_HOST not set');
}

export const config = {
    api: {
        // https://nextjs.org/docs/api-routes/api-middlewares#custom-config
        externalResolver: true,
        bodyParser: false, // not to use url encoded form like streaming POST request
    },
};

const proxyConfig = {
    target: PROXY_HOST,
    xfwd: true,
    headers: {
        host: new URL(PROXY_HOST).hostname,
    },
    pathRewrite: {
        '^/api': '',
    },
    onProxyReq: (proxyReq, req) => {
        const session: Session | undefined = req.session.get('session');

        proxyReq.setHeader('Accept', 'application/vnd.api+json; version=2');

        if (session) {
            proxyReq.setHeader('Authorization', `Token ${session.authToken}`);
        }
    },
};

export default withSession((req, res) => httpProxyMiddleware(req, res, proxyConfig));
