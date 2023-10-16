/* eslint-disable no-console */
const iso3311a2 = require( 'iso-3166-1-alpha-2' );
const fs = require( 'fs' );
const path = require( 'path' );

const fileListPath = path.join( __dirname, 'src/app', 'countriesList.json' );

const countriesList = {};
for ( const [ key, value ] of Object.entries( iso3311a2.getData() ) ) {
	countriesList[ key.toLowerCase() ] = value;
}

fs.writeFileSync( fileListPath, JSON.stringify( countriesList ), 'utf8' );

console.info( 'JSON with Countries generated successfully!' );
