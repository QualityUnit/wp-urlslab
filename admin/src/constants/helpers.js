export const urlInTextRegex = /(((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#?]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?)/;
export const urlRegex = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#?]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

/* Renames module id from ie urlslab-lazy-loading to LazyLoading
    Always capitalize first character in FileName.jsx after - when creating component/module !!!
    so urlslab-lazy-loading becomes LazyLoading.jsx component
  */
export const renameModule = ( moduleId ) => {
	if ( moduleId ) {
		const name = moduleId.replace( 'urlslab', '' );
		return name.replace( /-(\w)|^(\w)/g, ( char ) => char.replace( '-', '' ).toUpperCase() );
	}
};

// Delay some function (ie. onChange, onKeyUp)…
// Usage delay(()=> some.function, time in ms)();
export const delay = ( fn, ms ) => {
	let timer = 0;
	return function( ...args ) {
		clearTimeout( timer );
		timer = setTimeout( fn.bind( this, ...args ), ms || 0 );
	};
};

export const parseURL = ( string ) => {
	if ( string.length ) {
		return string.replace( urlInTextRegex, '<a href="$1" target="_blank">$1</a>' );
	}
};

export const langName = ( langcode ) => {
	const lang = new Intl.DisplayNames( [ 'en' ], { type: 'language' } );
	if ( langcode ) {
		return lang.of( langcode );
	}
	return null;
};

