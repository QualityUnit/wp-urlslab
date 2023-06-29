const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const fs = require( 'fs' );

// Define available blocks here, block name represents folder name too
const availableBlocks = [
	'related-articles',
	'screenshot',
];

function makeBlock( block ) {
	return {
		...defaultConfig,
		entry: {
			[ block ]: path.join( __dirname, `src/blocks/${ block }/index.js` ),
			[ `${ block }-editor` ]: path.join( __dirname, `src/blocks/${ block }/editor.scss` ),
		},
	};
}

const buildData = [];
availableBlocks.forEach( ( element ) => {
	if ( fs.existsSync( path.join( __dirname, `src/blocks/${ element }/index.js` ) ) ) {
		buildData.push( makeBlock( element ) );
	}
} );

module.exports = [ ...buildData ];
