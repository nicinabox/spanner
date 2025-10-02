module.exports = {
    generateBuildId: () => {
        const now = new Date();
        return [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0'),
        ].join('');
    },

    webpack: (config, { dev, webpack, buildId }) => {
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env.CONFIG_BUILD_ID': JSON.stringify(buildId),
            }),
        );

        config.module.rules.push({
            test: /\.(spec|stories)\.tsx?$/,
            loader: 'ignore-loader',
        });
        return config;
    },

    env: {
        BUGSNAG_API_KEY: process.env.BUGSNAG_API_KEY || '',
    },
};
