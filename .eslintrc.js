module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'airbnb',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {},
        },
    },

    rules: {
        'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/test.tsx', '**/test.ts'] }],
        '@typescript-eslint/indent': ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['off'],
        'import/extensions': ['off'],
        'class-methods-use-this': ['off'],
        "prefer-destructuring": ["error", {"object": true, "array": false}],
        'jsx-a11y/no-static-element-interactions': ["off"],
        'jsx-a11y/no-noninteractive-element-interactions': ["off"]
    },
    env: {
        browser: true,
        node: true,
    },
};
