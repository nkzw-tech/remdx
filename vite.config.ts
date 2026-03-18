import nkzw from '@nkzw/oxlint-config';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    experimentalSortImports: {
      newlinesBetween: false,
    },
    experimentalSortPackageJson: {
      sortScripts: true,
    },
    ignorePatterns: [
      'coverage/',
      'dist/',
      'node_modules/',
      'packages/create-remdx/index.mjs',
      'packages/remdx/index.d.ts',
      'packages/remdx/index.js',
      'packages/vite-plugin-remdx/index.d.ts',
      'packages/vite-plugin-remdx/index.mjs',
      'pnpm-lock.yaml',
      'tsconfig.tsbuildinfo',
      'vite.config.ts.timestamp-*',
    ],
    singleQuote: true,
  },
  lint: {
    extends: [nkzw],
    ignorePatterns: [
      'packages/create-remdx/template/**',
      'packages/create-remdx/index.mjs',
      'packages/remdx/index.d.ts',
      'packages/remdx/index.js',
      'packages/vite-plugin-remdx/index.d.ts',
      'packages/vite-plugin-remdx/index.mjs',
      'vite.config.ts.timestamp-*',
    ],
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    tasks: {
      'test:all': {
        command: 'vp check && vp test',
      },
    },
  },
  staged: {
    '*': 'vp check --fix',
  },
});
