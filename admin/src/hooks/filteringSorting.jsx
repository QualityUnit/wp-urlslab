import { useState } from 'react';

export function useFilter( ) {
	const [ currentFilters, setUrl ] = useState( {} );
	let filters = '';

	const addFilter = ( key, value ) => {
		if ( value ) {
			setUrl( { ...currentFilters, [ key ]: value } );
		}
		if ( ! value ) {
			removeFilters( [ key ] );
		}
	};
	function removeFilters( keyArray ) {
		setUrl( ( filter ) => {
			const filtersCopy = { ...filter };
			keyArray.map( ( key ) => {
				delete filtersCopy[ key ];
				return false;
			} );
			return filtersCopy;
		} );
	}

	Object.entries( currentFilters ).map( ( [ key, val ] ) => {
		filters += `&filter_${ key }=${ val }`;
		return false;
	} );

	return { filters, currentFilters, addFilter, removeFilters };
}

export function useSorting( ) {
	const [ sortingColumn, setSortingColumn ] = useState( '' );

	function sortBy( key ) {
		setSortingColumn( `&sort_column=${ key.replace( /(&ASC|&DESC)/, '' ) }&sort_direction=${ key.replace( /\w+&(ASC|DESC)/, '$1' ) }` );
	}

	return { sortingColumn, sortBy };
}
