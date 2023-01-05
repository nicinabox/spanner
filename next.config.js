module.exports = {
    generateBuildId: () => new Date().getTime().toString(),

    webpack: (config, { dev, webpack, buildId }) => {
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env.CONFIG_BUILD_ID': JSON.stringify(buildId),
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
};
