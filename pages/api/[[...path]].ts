import httpProxy from 'http-proxy';
import { withAPISession, withSession } from 'utils/session';

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

const proxy = httpProxy.createProxyServer(proxyConfig);

export default withAPISession((req, res) => {
    const { session }: { session: API.Session | undefined } = req.session;

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
