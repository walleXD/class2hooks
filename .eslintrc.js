module.exports = {
    parser: '@typescript-eslint/parser', 
    plugins: [
        "react-hooks"
    ],
    extends: [
        'plugin:@typescript-eslint/recommended', 
        'prettier/@typescript-eslint', 
        'plugin:prettier/recommended', 
        "plugin:react/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2018, 
        sourceType: 'module', 
    },
    rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    }
};