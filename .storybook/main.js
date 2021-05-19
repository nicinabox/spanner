const path = require("path");
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        plugins: [new TsconfigPathsPlugin({ extensions: config.resolve.extensions })],
        alias: {
          ...config.resolve.alias,
          "@emotion/core": toPath("node_modules/@emotion/react"),
          "emotion-theming": toPath("node_modules/@emotion/react"),
        },
      },
    }
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ]
}
