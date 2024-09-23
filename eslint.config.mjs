import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single'
  },
  vue: true,
  typescript: true,
  rules: {
    'style/semi': 0,
    'unused-imports/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],
    'no-console': 'off',
    // 'brace-style': ['error', '1tbs'],
  },
})
