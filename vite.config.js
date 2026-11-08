import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    host: true,
    port: 5173,
    watch: {
      ignored: ['**/.agents/**', '**/skills/**', '**/images/**']
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  optimizeDeps: {
    entries: ['./index.html']
  }
});

