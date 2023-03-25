import { useState } from 'react';

export function useFilter( ) {
	const [ currentFilters, setCurrentFilters ] = useState( {} );
	let filters = '';

	const addFilter = ( key, value ) => {
		if ( value ) {
			setCurrentFilters( { ...currentFilters, [ key ]: value } );
		}
		if ( ! value ) {
			removeFilters( [ key ] );
		}
	};
	function removeFilters( keyArray ) {
		setCurrentFilters( ( filter ) => {
			const filtersCopy = { ...filter };
			keyArray.map( ( key ) => {
				delete filtersCopy[ key ];
				return false;
			} );
			return filtersCopy;
		} );
	}

	Object.entries( currentFilters ).map( ( [ key, filter ] ) => {
		const { op, val } = filter;
		if ( ! op ) {
			filters += `&filter_${ key }=${ filter }`;
		}
		if ( op && op !== 'IN' && op !== 'BETWEEN' ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","val":"${ val }"}` ) }`;
		}
		if ( op && op === 'IN' ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","val":[${ val }]}` ) }`;
		}
		if ( op && op === 'BETWEEN' ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","min":${ val.min }, "max": ${ val.max }}` ) }`;
		}
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
