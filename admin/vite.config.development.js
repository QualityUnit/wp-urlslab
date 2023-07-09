import { defineConfig } from 'vite';
import { VitePluginFonts } from 'vite-plugin-fonts';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const hash = (Math.random() + 1).toString(36).substring(2);

export default defineConfig({
  base: './',
  plugins: [
    svgr(),
    react({
      jsxRuntime: 'classic',
    }),
  ],
  worker: [react()],
  build: {
    minify: false,
    rollupOptions: {
      input: {
        main: './src/main.jsx',
      },
      output: {
        entryFileNames: `[name]-${hash}.js`,
        chunkFileNames: `assets/[name]-${hash}.js`,
        assetFileNames: `assets/[name]-${hash}.[ext]`,
      },
    },
    chunkSizeWarningLimit: 60000,
  },
});
