import remdx from '@nkzw/vite-plugin-remdx';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    experimentalSortImports: {
      newlinesBetween: false,
    },
    experimentalSortPackageJson: {
      sortScripts: true,
    },
    ignorePatterns: ['dist/', 'index.html', 'pnpm-lock.yaml'],
    singleQuote: true,
  },
  plugins: [remdx(), react()],
  staged: {
    '*': 'vp check --fix',
  },
});
