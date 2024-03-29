import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-unresolved
import Unfonts from 'unplugin-fonts/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { svgSpritemap } from 'vite-plugin-svg-spritemap';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const hash = ( Math.random() + 1 ).toString( 36 ).substring( 2 );

// https://vitejs.dev/config/
export default defineConfig( {
	base: './',
	plugins: [
		svgSpritemap( {
			pattern: 'src/assets/images/icons/*.svg',
			svgo: {
				mergePaths: false,
				convertPathData: false,
				convertShapeToPath: false,
				collapseGroups: false,
				convertStyleToAttrs: false,
				convertTransform: false,
				removeAttrs: { attrs: '(fill|stroke)' },
			},
		} ),
		ViteImageOptimizer(),
		svgr(),
		react( {
			jsxRuntime: 'classic',
		} ),
		Unfonts( {
			google: {
				families: [
					{
						name: 'Poppins',
						styles: 'wght@300;400;500;600;700', // sizes 300, 500, 600, 700 used by mui
					},
					{
						name: 'Open+Sans',
						styles: 'wght@300;400;500;600;700', // sizes 300, 500, 600, 700 used by mui
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
		watch: false,
		minify: true,
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
