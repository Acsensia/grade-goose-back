import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },
  js.configs.recommended,
  prettierConfig,
  {
    plugins: { prettierPlugin },
    rules: {
      'prettierPlugin/prettier': 'error',
      'no-console': 'off',
    },
  },
  eslintPluginPrettierRecommended,
]);
