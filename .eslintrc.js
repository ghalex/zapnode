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
      'packages/core/tsconfig.json'
    ]
    // project: './tsconfig.json',
    // tsconfigRootDir: __dirname
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
}
