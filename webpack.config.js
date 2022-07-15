/**
 * External Dependencies
 */
const path = require( 'path' );

/**
 * WordPress Dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	...{
		entry: {
			qu_enhanced_faq_edit_item: path.resolve(
				process.cwd(),
				'src',
				'edit_faq_item.js'
			),
			qu_enhanced_faq_edit: path.resolve(
				process.cwd(),
				'src',
				'edit.js'
			),
			// If you have JS for frontend part (ie. saving status to visitor Local Storage, togglers etc.)
			// qu_enhanced_faq_frontend: path.resolve(
			// 	process.cwd(),
			// 	'src',
			// 	'frontend.js'
			// ),
			// Design that might be different from editor
			qu_enhanced_faq_frontend: path.resolve(
				process.cwd(),
				'src/scss',
				'frontend.scss'
			),
		},
	},
};
