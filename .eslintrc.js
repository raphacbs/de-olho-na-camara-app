module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    // generic JS rules
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    // TypeScript files: use @typescript-eslint/parser and plugin with type-aware rules
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
      ],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
    // Use default JS parser for plain JavaScript files and script files so they don't require TS parserOptions.project
    {
      files: ['*.js', 'scripts/**', 'test-*.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      rules: {
        // JS-specific rule overrides could go here
      },
    },
    // For config files that may not be included in tsconfig, allow linting as JS
    {
      files: ['metro.config.js', '.eslintrc.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  ],
};
