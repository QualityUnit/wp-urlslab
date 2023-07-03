import { defineConfig } from 'vite';
import { VitePluginFonts } from 'vite-plugin-fonts';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const hash = ( Math.random() + 1 ).toString( 36 ).substring( 2 );

// https://vitejs.dev/config/
export default defineConfig( {
	base: './',
	plugins: [
		ViteImageOptimizer(),
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
		minify: false,
		rollupOptions: {
			input: {
				main: './src/main.jsx',
			},
			onwarn( warning, warn ) {
				if ( warning.code === 'MODULE_LEVEL_DIRECTIVE' ) {
					return;
				}
				warn( warning );
			},
			output: {
				// this gets rid of the hash on main.css
				entryFileNames: `[name]-${ hash }.js`,
				chunkFileNames: `assets/[name]-${ hash }.js`,
				assetFileNames: `assets/[name]-${ hash }.[ext]`,
			},
		},
		// prevent some warnings
		chunkSizeWarningLimit: 60000,
	},
} );
