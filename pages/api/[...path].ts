import https from 'https';
import { createProxyMiddleware } from 'http-proxy-middleware';

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

export default createProxyMiddleware({
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
});
