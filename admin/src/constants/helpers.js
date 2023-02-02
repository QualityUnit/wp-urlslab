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

