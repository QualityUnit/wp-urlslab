import data from '../app/generatedData/countriesList.json';

export const countriesList = data;
export const countriesListForSelect = Object.keys( data ).reduce( ( acc, key ) => ( { ...acc, [ key ]: key + ' - ' + data[ key ] } ), {} );
export const countryCodes = Object.keys( data );

