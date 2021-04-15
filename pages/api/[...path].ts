import httpProxy from 'http-proxy'
import Cookies from 'cookies'

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
        // In case the current API request is for logging in,
        // we'll need to intercept the API response.
        const isLogin = req.url === '/api/login'

        // Get the `auth-token` cookie:
        const cookies = new Cookies(req, res)
        const authToken = cookies.get('auth-token')

        // Rewrite the URL: strip out the leading '/api'.
        // For example, '/api/login' would become '/login'.
        req.url = req.url.replace(/^\/api/, '')

        // Don't forward cookies to the API:
        req.headers.cookie = ''

        // Set auth-token header from cookie:
        if (authToken) {
            req.headers['auth-token'] = authToken
        }

        // In case the request is for login, we need to
        // intercept the API's response. It contains the
        // auth token that we want to strip out and set
        // as an HTTP-only cookie.
        if (isLogin) {
            proxy.once('proxyRes', interceptLoginResponse)
        }

        // Don't forget to handle errors:
        proxy.once('error', reject)

        // Forward the request to the API
        proxy.web(req, res, {
            target: PROXY_HOST,
            // Don't autoRewrite because we manually rewrite
            // the URL in the route handler.
            autoRewrite: false,
            // In case we're dealing with a login request,
            // we need to tell http-proxy that we'll handle
            // the client-response ourselves (since we don't
            // want to pass along the auth token).
            selfHandleResponse: isLogin
        })

        function interceptLoginResponse(proxyRes, req, res) {
            // Read the API's response body from
            // the stream:
            let apiResponseBody = ''
            proxyRes.on('data', (chunk) => {
                apiResponseBody += chunk
            })

            // Once we've read the entire API
            // response body, we're ready to
            // handle it:
            proxyRes.on('end', () => {
                try {
                    // Extract the authToken from API's response:
                    const { authToken, ...session } = JSON.parse(apiResponseBody)

                    // Set the authToken as an HTTP-only cookie.
                    // We'll also set the SameSite attribute to
                    // 'lax' for some additional CSRF protection.
                    const cookies = new Cookies(req, res)
                    cookies.set('auth-token', authToken, {
                        httpOnly: true,
                        sameSite: 'lax'
                    })

                    // Our response to the client won't contain
                    // the actual authToken. This way the auth token
                    // never gets exposed to the client.
                    res.status(200).json({ session })
                    resolve('ok')
                } catch (err) {
                    reject(err)
                }
            })
        }
    })
}