import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

export function useFilter( { slug } ) {
	const [ currentFilters, setUrl ] = useState( {} );
	const [ tableQuery, setTableQuery ] = useState( {} );
	let filters = '';

	useEffect( () => {
		get( slug ).then( ( query ) => {
			const q = query?.currentFilters;
			setUrl( Object.keys( q ).length ? q : {} );
			setTableQuery( tableQuery );
		} );
	}, [ slug, tableQuery ] );

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
			set( slug, { ...tableQuery, currentFilters: filtersCopy } );
			return filtersCopy;
		} );
		// get( slug ).then( ( tableQuery ) => {
		// } );
	}

	Object.entries( currentFilters ).map( ( [ key, val ] ) => {
		filters += `&filter_${ key }=${ val }`;
		set( slug, { currentFilters, url: filters } );
		return false;
	} );

	return { filters, currentFilters, addFilter, removeFilters };
}

export function useSorting() {
	const [ sortingColumn, setSortingColumn ] = useState( '' );

	const sortBy = ( key ) => setSortingColumn( `&sort_column=${ key.replace( /(&ASC|&DESC)/, '' ) }&sort_direction=${ key.replace( /\w+&(ASC|DESC)/, '$1' ) }` );

	return { sortingColumn, sortBy };
}
