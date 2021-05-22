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

    future: {
        webpack5: true,
    },
};
