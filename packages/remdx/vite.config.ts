import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    clean: false,
    dts: true,
    entry: ['./index.tsx'],
    format: ['esm'],
    outDir: '.',
    platform: 'browser',
    target: 'es2022',
  },
});
