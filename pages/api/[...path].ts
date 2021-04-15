import httpProxy from 'http-proxy'

const { PROXY_HOST } = process.env

// You can export a config variable from any API route in Next.js.
// We'll use this to disable the bodyParser, otherwise Next.js
// would read and parse the entire request body before we
// can forward the request to the API. By skipping the bodyParser,
// we can just stream all requests through to the actual API.
export const config = {
    api: {
        bodyParser: false
    }
}

const proxy = httpProxy.createProxyServer();

export default (req, res) => {
    // Return a Promise to let Next.js know when we're done
    // processing the request:
    return new Promise((resolve, reject) => {
        // Rewrite the URL: strip out the leading '/api'.
        // For example, '/api/login' would become '/login'.
        req.url = req.url.replace(/^\/api/, '')

        // Don't forget to handle errors:
        proxy.once('error', reject)

        // Forward the request to the API
        proxy.web(req, res, {
            target: PROXY_HOST,
        })
    })
}