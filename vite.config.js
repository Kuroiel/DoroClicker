import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

export default defineConfig({
  plugins: [
    svelte(),
    adapter({
      fallback: 'index.html'
    })
  ],
  base: './', // Critical for GitHub Pages
  build: {
    target: 'esnext',
    assetsInlineLimit: 0
  }
});