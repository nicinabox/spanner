module.exports = {
    future: {
        webpack5: true,
    },
    async rewrites() {
        return [
            {
                source: '/api',
                destination: process.env.PROXY_HOST,
            },
        ]
    },
}
