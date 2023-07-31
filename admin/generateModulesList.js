/* eslint-disable no-console */
const fs = require( 'fs' );
const path = require( 'path' );

const modulesPath = path.join( __dirname, 'src/modules' );

fs.readdir( modulesPath, ( err, files ) => {
	if ( err ) {
		console.error( 'Cannot read the folder with modules:', err );
		process.exit( 1 );
	}

	const fileListPath = path.join( __dirname, 'src/app', 'generatedModulesList.json' );
	const fileList = files.filter( ( file ) => fs.statSync( path.join( modulesPath, file ) ).isFile() && path.extname( file ) === '.jsx' );
	const modules = fileList.map( ( filename ) => filename.replace( '.jsx', '' ) );

	fs.writeFileSync( fileListPath, JSON.stringify( modules ), 'utf8' );

	console.info( 'JSON with modules generated successfully!' );
} );
