import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    clean: false,
    entry: ['./index.ts'],
    format: ['esm'],
    outDir: '.',
    target: 'node22',
  },
});
