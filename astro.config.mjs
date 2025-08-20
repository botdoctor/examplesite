// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    react(),
    tailwind()
  ],
  vite: {
    ssr: {
      external: ['three']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'three-vendor': ['three'],
            'react-vendor': ['react', 'react-dom'],
            'three-fiber': ['@react-three/fiber', '@react-three/drei']
          }
        }
      },
      chunkSizeWarningLimit: 600
    }
  }
});
