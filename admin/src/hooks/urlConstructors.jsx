import { useState } from 'react';

export function useFilter() {
	const [ currentFilters, setUrl ] = useState( {} );
	let filters = '';

	const addFilter = ( key, value ) => setUrl( { ...currentFilters, [ key ]: value } );
	const removeFilter = ( key ) => setUrl( ( filter ) => {
		const copy = { ...filter };
		delete copy[ key ];
		return copy;
	} );

	Object.entries( currentFilters ).map( ( [ key, val ] ) => {
		filters += `&filter_${ key }=${ val }`;
		return false;
	} );

	return { filters, currentFilters, addFilter, removeFilter };
}

export function useSorting() {
	const [ sortingColumn, setSortingColumn ] = useState();

	const sortBy = ( key ) => setSortingColumn( `&sort_column=${ key }` );

	return { sortingColumn, sortBy };
}
