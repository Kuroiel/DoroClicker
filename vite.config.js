import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    svelte(),
    viteStaticCopy({
      targets: [
        { src: 'assets/*', dest: 'assets' }
      ]
    })
  ],
  build: {
    assetsInlineLimit: 0 // Ensure assets are copied
  }
});