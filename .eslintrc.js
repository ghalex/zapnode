module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      'packages/zp/tsconfig.json',
      'packages/zp-plugins/tsconfig.json',
      'packages/zp-data/tsconfig.json',
      'playground/hello/tsconfig.json'
    ]
    // tsconfigRootDir: __dirname
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off'
  }
}
