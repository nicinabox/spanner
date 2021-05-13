import httpProxy from 'http-proxy';
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
};

// export default withSession((req, res) => httpProxyMiddleware(req, res, proxyConfig));

// const proxy = createProxyMiddleware({
//     ...proxyConfig,
//     pathRewrite: (path, req) => {
//         const nextPath = path.replace('/api', '');
//         console.log(req.method, nextPath) // eslint-disable-line

//         return nextPath;
//     },
// });

const proxy = httpProxy.createProxyServer(proxyConfig);

export default withSession((req, res) => {
    const session: Session | undefined = req.session.get('session');

    // Return a Promise to let Next.js know when we're done processing the request
    return new Promise((resolve, reject) => {
        req.url = req.url.replace(/^\/api/, '');

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        proxy.once('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Accept', 'application/vnd.api+json; version=2');

            if (session) {
                proxyReq.setHeader('Authorization', `Token ${session.authToken}`);
            }
        });

        proxy.once('error', reject);
        proxy.once('proxyRes', resolve as any);

        // Forward the request to the API
        proxy.web(req, res);
    });
});
