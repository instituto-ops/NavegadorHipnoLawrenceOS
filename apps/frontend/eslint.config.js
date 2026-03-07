import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import typescriptEslint from 'typescript-eslint';
import tailwindPlugin from 'eslint-plugin-better-tailwindcss';

import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      '.vite',
      'coverage',
      'build',
      '.env*',
      'out',
      'release',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: typescriptEslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
      'better-tailwindcss': { entryPoint: 'src/index.css' },
},
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'better-tailwindcss': tailwindPlugin,
      '@typescript-eslint': typescriptEslint.plugin,

      prettier: prettierPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/display-name': 'warn',
      'react/jsx-key': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
'@typescript-eslint/explicit-function-return-type': 'off',
'@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'off',
      'better-tailwindcss/no-unnecessary-whitespace': 'warn',
      'better-tailwindcss/no-duplicate-classes': 'error',
'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
      'prettier/prettier': 'error',
    },
  },
];
