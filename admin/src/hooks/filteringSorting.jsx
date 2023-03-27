import { useState, useReducer, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import filterReducer from '../constants/filterReducer';

const filterObj = {
	filterKey: undefined,
	filterOp: undefined,
	filterVal: undefined,
	isNumber: false,
};

export function useFilter( { slug, header, possibleFilters, initialRow } ) {
	const [ currentFilters, setCurrentFilters ] = useState( {} );
	const queryClient = useQueryClient();
	const runFilter = useRef( false );
	const [ state, dispatch ] = useReducer( filterReducer, { possibleFilters: possibleFilters.current, filterObj, panelActive: false } );

	const activeFilters = currentFilters ? Object.keys( currentFilters ) : null;

	let filters = '';

	function addFilter( key, value ) {
		if ( value ) {
			setCurrentFilters( { ...currentFilters, [ key ]: value } );
		}
		if ( ! value ) {
			removeFilters( [ key ] );
		}
	}
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

	const handleType = useCallback( ( key ) => {
		dispatch( { type: 'setNumeric', isNumber: false } );
		if ( typeof initialRow[ key ] === 'number' ) {
			dispatch( { type: 'setNumeric', isNumber: true } );
		}
	}, [ dispatch, initialRow ] );

	const handleSaveFilter = () => {
		const { filterKey, filterOp, filterVal } = state.filterObj;
		let key = filterKey;
		const op = filterOp;
		const val = filterVal;

		if ( ! key ) {
			key = Object.keys( state.possibleFilters )[ 0 ];
		}

		delete state.possibleFilters[ key ];
		dispatch( { type: 'possibleFilters', possibleFilters: possibleFilters.current } );
		dispatch( { type: 'toggleFilterPanel', panelActive: false } );

		if ( ! op ) {
			addFilter( key, val );
		}

		if ( op ) {
			addFilter( key, { op, val } );
		}

		runFilter.current = true;
	};

	const handleEditFilter = () => {
		return false;
	};

	const handleRemoveFilter = ( keysArray ) => {
		if ( keysArray?.length === 1 ) {
			const key = keysArray[ 0 ];
			const newHeader = { ...header };
			const usedFilters = activeFilters.filter( ( k ) => k !== key );
			usedFilters.map( ( k ) => {
				delete newHeader[ k ];
				return false;
			} );

			dispatch( { type: 'possibleFilters', possibleFilters: newHeader } );
		}
		if ( keysArray?.length > 1 ) {
			dispatch( { type: 'possibleFilters', possibleFilters: { ...header } } );
		}

		removeFilters( keysArray );

		runFilter.current = true;
	};

	if ( runFilter.current ) {
		runFilter.current = false;
		queryClient.setQueryData( [ slug, 'filters' ], { filters, currentFilters, possibleFilters: possibleFilters.current } );
	}

	return { filters, currentFilters, addFilter, removeFilters, state, dispatch, handleType, handleSaveFilter, handleRemoveFilter, runFilter };
}

export function useSorting( { slug } ) {
	const [ sortingColumn, setSortingColumn ] = useState( '' );
	const queryClient = useQueryClient();

	function sortBy( key ) {
		queryClient.setQueryData( [ slug, 'sortBy' ], key );
		setSortingColumn( `&sort_column=${ key.replace( /(&ASC|&DESC)/, '' ) }&sort_direction=${ key.replace( /\w+&(ASC|DESC)/, '$1' ) }` );
	}

	return { sortingColumn, sortBy };
}
