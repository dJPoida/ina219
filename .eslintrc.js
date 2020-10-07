module.exports = {
  extends: [
    'plugin:node/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'node',
    'prettier',
  ],
  env: {
    node: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {},
    },
    'settings': {
      'import/extensions': ['.js', '.ts']
    },
  },
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': ['error', {
      'allowModules': [],
      'tryExtensions': ['.ts', '.js', '.json', '.node']
    }]
  },
};
