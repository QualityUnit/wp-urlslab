import data from '../app/countriesList.json';

const usFirst = ( originalData ) => {
	const o = { ...originalData };
	const us = o.us;
	delete o.us;
	return { us, ...o };
};

export const countriesList = data;
export const countriesListUsFirst = usFirst( data );
export const countryCodes = Object.keys( data );

// simple Select format: { key1: "key1 - value1", key2: "key2 - value2" }
export const countriesListForSelect = Object.keys( countriesListUsFirst ).reduce( ( acc, key ) => ( { ...acc, [ key ]: `${ key } - ${ data[ key ] }` } ), {} );

// Autocomplete format: { key1: { label: value1, id: key1 }, key2: { label: value2, id: key2 } }
export const countriesListForAutocomplete = Object.keys( countriesListUsFirst ).reduce( ( acc, key ) => ( { ...acc, [ key ]: { label: data[ key ], id: key } } ), {} );
