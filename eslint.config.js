import js from '@eslint/js'
import globals from 'globals'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

import rocketseatEslintConfig from '@rocketseat/eslint-config/react.mjs'

export default tseslint.config(
  ...rocketseatEslintConfig,
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'simple-import-sort/imports': 'error',
      camelcase: 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@stylistic/max-len': 'off',
      'prefer-promise-reject-errors': 'off',
    },
  },
)
