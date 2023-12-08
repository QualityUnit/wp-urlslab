/* global wpApiSettings */

export const rootUrl = window.urlslabData.urls.root;
export const rootAdminUrl = window.urlslabData.urls.rootAdmin;
import { countriesListUsFirst } from '../api/fetchCountries';

export const urlInTextRegex = /(((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#?]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?)/;

/* Renames module id from ie urlslab-lazy-loading to LazyLoading
    Always capitalize first character in FileName.jsx after - when creating component/module !!!
    so urlslab-lazy-loading becomes LazyLoading.jsx component
  */
export const renameModule = ( moduleId ) => {
	if ( moduleId ) {
		const name = moduleId?.replace( 'urlslab', '' );
		return name.replace( /-(\w)|^(\w)/g, ( char ) => char.replace( '-', '' ).toUpperCase() );
	}
};

export const getJson = ( param ) => {
	try {
		return JSON.parse( param );
	} catch ( e ) {
		return null;
	}
};

// get module name from full route
export const getModuleNameFromRoute = ( sourceRoute ) => {
	const route = sourceRoute.charAt( 0 ) === '/' ? sourceRoute.slice( 1 ) : sourceRoute;
	const routeParts = route.split( '/' );
	return routeParts[ 0 ];
};

// get keys from Map object
export const getMapKeysArray = ( items ) => {
	if ( items ) {
		return Array.from( items ).map( ( [ key ] ) => {
			return key;
		} );
	}
	return [];
};

// Delay some function (ie. onChange, onKeyUp)…
// Usage delay(()=> some.function, time in ms)();
let delayTimer = 0;
export const delay = ( fn, ms ) => {
	return function( ...args ) {
		if ( delayTimer ) {
			clearTimeout( delayTimer );
		}
		delayTimer = setTimeout( fn.bind( this, ...args ), ms || 0 );
	};
};

export const dateWithTimezone = ( val ) => {
	const origDate = new Date( val );
	const diff = origDate.getTimezoneOffset();
	const correctedDate = new Date( origDate.getTime() - ( diff * 60000 ) ).toISOString();

	return { origDate, correctedDate };
};

//Checks if 12 hour format is set
export const is12hourFormat = ( ) => {
	const { date, getSettings } = window.wp.date;
	const formattedTime = date( getSettings().formats.time, new Date() );
	const timeRegex = /(am|pm)/g;

	if ( timeRegex.test( formattedTime.toLowerCase() ) ) {
		return true;
	}

	return false;
};

// get format in date-fns format for React DatePicker https://date-fns.org/docs/format
export const getDateFnsFormat = () => {
	const { getSettings } = window.wp.date;
	const date = convertWpDatetimeFormatToDateFns( getSettings().formats.date );
	const time = convertWpDatetimeFormatToDateFns( getSettings().formats.time );
	return {
		date,
		time,
		datetime: `${ date }, ${ time }`,
	};
};

// validate date response from server for possible nullish dates like "0000-00-00"
export const notNullishDate = ( dateString ) => dateString.charAt( 0 ) !== '0';

// convert Wordpress date/time format to date-fns format
export const convertWpDatetimeFormatToDateFns = ( wpFormat ) => {
	const formatMapping = {
		d: 'dd',
		D: 'EEE',
		j: 'd',
		l: 'EEEE',
		F: 'MMMM',
		m: 'MM',
		M: 'MMM',
		n: 'M',
		Y: 'yyyy',
		y: 'yy',
		H: 'HH',
		G: 'H',
		h: 'hh',
		g: 'h',
		i: 'mm',
		s: 'ss',
		a: 'aaa',
		A: 'aa',
		T: 'zzzz',
	};
	return wpFormat.replace( /(d|D|j|l|F|m|M|n|Y|y|H|G|h|g|i|s|a|A|T)/g, ( match ) => formatMapping[ match ] || match );
};

export const parseURL = ( string ) => {
	if ( string.length ) {
		return string.replace( urlInTextRegex, '<a href="$1" target="_blank">$1</a>' );
	}
};

export const langName = ( langcode, validate ) => {
	const lang = new Intl.DisplayNames( [ 'en' ], { type: 'language' } );
	if ( typeof langcode === 'string' && langcode?.length >= 2 ) {
		try {
			return lang.of( langcode );
		} catch ( error ) {
			if ( error instanceof RangeError ) {
				return validate ? 'error' : null;
			}
			return lang.of( langcode );
		}
	}
	return validate ? 'error' : null;
};

export const nameOf = ( obj, key ) => {
	const res = {};
	Object.keys( obj ).map( ( k ) => {
		res[ k ] = () => k;
		return false;
	} );
	return key( res )();
};

export const getParamsChar = () => {
	if ( wpApiSettings.root.indexOf( '?' ) > -1 ) {
		return '&';
	}
	return '?';
};

export const arraysEqual = ( a, b ) => {
	if ( a.length !== b.length ) {
		return false;
	}

	for ( let i = 0; i < a.length; i++ ) {
		if ( a[ i ] !== b[ i ] ) {
			return false;
		}
	}

	return true;
};

export const textLinesToArray = ( value ) => {
	if ( typeof value !== 'string' ) {
		return [];
	}
	return value.split( '\n' )
		.map( ( line ) => line.trim() )
		.filter( ( line ) => line !== '' );
};

export const extractInitialCountry = () => {
	let guessedCountryCode = 'us';
	const currentDomain = document.location.origin.split( '.' );
	if ( currentDomain.length > 1 ) {
		if ( Object.keys( countriesListUsFirst ).includes( currentDomain[ currentDomain.length - 1 ] ) ) {
			guessedCountryCode = currentDomain[ currentDomain.length - 1 ];
		}
	}

	return guessedCountryCode;
};

export const arrayToTextLines = ( value ) => {
	return Array.isArray( value ) ? value.join( '\n' ) : '';
};

export const urlHasProtocol = ( value ) => {
	const protocolRegex = /^https?:\/\//i;
	return protocolRegex.test( value );
};

// useful for selects inputs where we need to return the same type of option as was provided in source items
export const checkItemReturnType = ( defaultValue, items ) => {
	if ( defaultValue === undefined || defaultValue === '' ) {
		return defaultValue;
	}
	// if provided defaultValue is number, return number
	// if provided defaultValue is string than can be available as number in provided items keys, return it as number
	return ! isNaN( defaultValue ) && Object.keys( items ).includes( defaultValue )
		? +defaultValue
		: defaultValue;
};

// sort source array following order in another array
// useful for multiselects where we do not want return values in order as user picked them
export const sortArrayByArray = ( sourceArray, arrayWithDefinedOrder ) => {
	const typedArray = arrayWithDefinedOrder.map( ( key ) => ( isNaN( key ) ? key : Number( key ) ) );
	return [ ...sourceArray ].sort( ( a, b ) => {
		return typedArray.indexOf( a ) - typedArray.indexOf( b );
	} );
};

export const isObject = ( value ) => typeof value === 'object' && value !== null;

// check if object or array is only one-dimensional
export const isNestedObject = ( value ) => {
	if ( Array.isArray( value ) ) {
		return value.some( ( item ) => Array.isArray( item ) || isObject( item ) );
	}
	if ( isObject( value ) ) {
		return Object.values( value ).some( ( item ) => Array.isArray( item ) || isObject( item ) );
	}
	return false;
};

// hide wp header notification about missing api key after adding api key
export const hideWpHeaderNoApiNotification = () => {
	const wpHeaderNotification = document.querySelector( '#wp-admin-bar-urlslab-menu span.notification-api-key' );
	if ( wpHeaderNotification ) {
		wpHeaderNotification.style.display = 'none';
	}
};
