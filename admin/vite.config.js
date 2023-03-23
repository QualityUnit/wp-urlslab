import { defineConfig } from 'vite';
import { VitePluginFonts } from 'vite-plugin-fonts';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig( {
	base: './',
	plugins: [
		svgr(),
		react( {
			jsxRuntime: 'classic',
		} ),
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
	worker: [ react() ],
	server: {
		port: 1337,
	},
	build: {
		// minify: false,
		rollupOptions: {
			input: {
				main: './src/main.jsx',
			},
			output: {
				// this gets rid of the hash on main.css
				entryFileNames: '[name].js',
				assetFileNames: 'assets/[name].[ext]',
			},
		},
		// prevent some warnings
		chunkSizeWarningLimit: 60000,
	},
} );
