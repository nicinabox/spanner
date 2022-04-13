const nextBuildId = require('next-build-id');

module.exports = {
    generateBuildId: () => nextBuildId({ dir: __dirname }),

    webpack: (config, { dev, webpack, buildId }) => {
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env.CONFIG_BUILD_ID': JSON.stringify(dev ? buildId : buildId.substr(0, 8)),
            }),
        );

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

    experimental: {
        runtime: 'nodejs',
    },
};
