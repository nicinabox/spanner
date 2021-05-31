module.exports = {
    webpack: (config, { dev }) => {
        config.module.rules.push(
            {
                test: /\.(spec|stories)\.tsx?$/,
                loader: 'ignore-loader',
            },
        );
        return config;
    },

    env: {
        BUGSNAG_API_KEY: process.env.BUGSNAG_API_KEY,
    },

    future: {
        webpack5: true,
    },
};
