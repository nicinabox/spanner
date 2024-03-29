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
        'plugin:@next/next/recommended'
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
        'no-restricted-exports': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'off',

        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-empty-interface': 'warn',

        '@typescript-eslint/explicit-module-boundary-types': 'off',

        'import/no-extraneous-dependencies': ['error', {
            devDependencies: ['jest.setup.ts', '**/*.spec.ts', '**/*.spec.tsx'],
        }],

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

        'react/no-array-index-key': 'warn',
        'react/require-default-props': 'off',
        'react/no-unused-prop-types': 'warn',
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/function-component-definition': 'off',

        'arrow-body-style': 'off',

        indent: 'off',
        '@typescript-eslint/indent': ['error', 4, { ignoredNodes: ['JSXElement *', 'JSXElement'] }],

        'import/prefer-default-export': 'off',
        'max-len': 'off',
    },
};
