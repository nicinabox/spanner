module.exports = {
    settings: {
        'import/resolver': {
            typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
        },
    },
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'off',

        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-empty-interface': 'warn',

        '@typescript-eslint/explicit-module-boundary-types': 'off',

        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],

        'react/jsx-filename-extension': ['error', {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }],

        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-indent': ['error', 4],

        indent: 'off',
        '@typescript-eslint/indent': ['error', 4, { ignoredNodes: ['JSXElement *', 'JSXElement'] }],

        'import/prefer-default-export': 'off',
        'max-len': 'off',
    },
};
