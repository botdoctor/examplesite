// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
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
