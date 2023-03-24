import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

export function useFilter( { slug } ) {
	const [ currentFilters, setUrl ] = useState( {} );
	// const [ tableQuery, setTableQuery ] = useState( {} );
	let filters = '';

	// useEffect( () => {
	// 	get( slug ).then( ( query ) => {
	// 		const q = query?.currentFilters;
	// 		setUrl( Object.keys( q ).length ? q : {} );
	// 		setTableQuery( query );
	// 	} );
	// }, [ slug ] );

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
		// set( slug, { ...tableQuery, url: filters, currentFilters } );
	}

	Object.entries( currentFilters ).map( ( [ key, val ] ) => {
		filters += `&filter_${ key }=${ val }`;
		// set( slug, { ...tableQuery, url: filters, currentFilters } );
		return false;
	} );

	return { filters, currentFilters, addFilter, removeFilters };
}

export function useSorting( { slug } ) {
	const [ sortingColumn, setSortingColumn ] = useState( '' );
	// const [ tableQuery, setTableQuery ] = useState( {} );
	// useEffect( () => {
	// 	get( slug ).then( ( query ) => {
	// 		setTableQuery( query );
	// 	} );
	// }, [ slug ] );

	function sortBy( key ) {
		setSortingColumn( `&sort_column=${ key.replace( /(&ASC|&DESC)/, '' ) }&sort_direction=${ key.replace( /\w+&(ASC|DESC)/, '$1' ) }` );
		// set( slug, { sortKey: key } );
	}

	return { sortingColumn, sortBy };
}
