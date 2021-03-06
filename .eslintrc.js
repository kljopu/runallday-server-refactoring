module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8,
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    // 'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    curly: ['error', 'all'],
    'object-shorthand': ['error', 'always'],
    'no-new-object': ['error'],
    'quote-props': ['error', 'as-needed'],
    'no-array-constructor': ['error'],
    'array-callback-return': ['error'],
    'prefer-template': ['error'],
    'template-curly-spacing': ['error', 'never'],
    'no-eval': ['error'],
    // 'func-style': [] // https://eslint.org/docs/rules/func-style
    'no-loop-func': ['error'],
    'prefer-rest-params': ['error'],
    'default-param-last': ['error'],
    'no-new-func': ['error'],
    'space-before-function-paren': [
      'error',
      { anonymous: 'never', named: 'never', asyncArrow: 'always' },
    ],
    'space-before-blocks': ['error', 'always'],
    'no-param-reassign': ['error'],
    'prefer-spread': ['error'],
    'prefer-arrow-callback': ['warn'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'arrow-parens': ['error', 'as-needed'],
    '@typescript-eslint/no-useless-constructor': ['error'],
    'no-duplicate-imports': ['error'],
    'dot-notation': ['error'],
    'no-undef': ['error'],
    'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
    'no-multi-assign': ['error'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-nested-ternary': ['error'],
    'space-infix-ops': ['error'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
  },
};
