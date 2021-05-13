import https from 'https';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Session } from 'queries/session';
import { withSession } from 'utils/session';

// eslint-disable-next-line prefer-destructuring
const PROXY_HOST = process.env.PROXY_HOST;
// eslint-disable-next-line prefer-destructuring
const NODE_ENV = process.env.NODE_ENV;

if (!PROXY_HOST) {
    throw new Error('PROXY_HOST not set');
}

const isProd = NODE_ENV === 'production';

export const config = {
    api: {
        // https://nextjs.org/docs/api-routes/api-middlewares#custom-config
        externalResolver: true,
        bodyParser: false, // not to use url encoded form like streaming POST request
    },
};

const host = new URL(PROXY_HOST).hostname;

const baseProxyConfig = {
    target: PROXY_HOST,
    changeOrigin: true,
    pathRewrite: (path, req) => {
        const nextPath = path.replace('/api', '');
        console.log(req.method, nextPath) // eslint-disable-line

        return nextPath;
    },
    agent: isProd ? https.globalAgent : false,
    headers: {
        host,
    },
};

export default withSession((req, res) => {
    const session: Session | undefined = req.session.get('session');

    const onProxyReq = (proxyReq) => {
        proxyReq.setHeader('Accept', 'application/vnd.api+json; version=2');

        if (session) {
            proxyReq.setHeader('Authorization', `Token ${session.authToken}`);
        }
    };

    return createProxyMiddleware({
        ...baseProxyConfig,
        onProxyReq,
    });
});
