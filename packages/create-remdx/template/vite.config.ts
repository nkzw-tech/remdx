import remdx from '@nkzw/vite-plugin-remdx';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [remdx(), react()],
});
