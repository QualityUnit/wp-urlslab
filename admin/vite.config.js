import { defineConfig } from 'vite'
import { VitePluginFonts } from 'vite-plugin-fonts'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
//   root: '../admin',
  plugins: [svgr(), react(), VitePluginFonts({
    google: {
    families: [
     {
        name: 'Poppins',
        styles: 'wght@400;600;700'
     },
     {
        name: 'Open+Sans',
        styles: 'wght@400;600;700'
     }
    ],
    },
}), ],
  build: {
      rollupOptions: {
          output: {
              // Prevent vendor.js being created
              manualChunks: undefined,
              // this got rid of the hash on style.css
              entryFileNames: "settings.js",
              assetFileNames: "assets/[name].[ext]",
          },
      },
      // Prevent vendor.css being created
      cssCodeSplit: false,
      // prevent some warnings
      chunkSizeWarningLimit: 60000,
  },
})
