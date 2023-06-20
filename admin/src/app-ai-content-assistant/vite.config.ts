import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePluginFonts } from 'vite-plugin-fonts';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig( {
	base: './',
	plugins: [
		ViteImageOptimizer(),
		svgr(),
		react(),
		VitePluginFonts( {
			google: {
				families: [
					{
						name: 'Poppins',
						styles: 'wght@400;600;700',
					},
					{
						name: 'Open+Sans',
						styles: 'wght@400;600;700',
					},
				],
			},
		} ),
	],
	server: {
		port: 1337,
	},
	build: {
		minify: true,
		rollupOptions: {
			input: {
				main: './src/main.tsx',
			},
			output: {
				entryFileNames: '[name]-[hash].js',
				chunkFileNames: 'assets/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]',
			},
		},
		// prevent some warnings
		chunkSizeWarningLimit: 60000,
	},
} );
