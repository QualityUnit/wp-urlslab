import { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import filterReducer from '../lib/filterReducer';
import filterArgs from '../lib/filterOperators';

const filterObj = {
	filterKey: undefined,
	filterOp: undefined,
	filterVal: undefined,
	keyType: undefined,
};

export function useFilter( { slug, header, initialRow } ) {
	const queryClient = useQueryClient();
	const runFilter = useRef( false );
	const possibleFilters = useRef( { ...header } );
	const [ state, dispatch ] = useReducer( filterReducer, { currentFilters: {}, filteringState: undefined, possibleFilters: possibleFilters.current, filterObj, editFilterActive: false } );

	const filters = filterArgs( state.currentFilters ); // Generates filter endpoint arguments for API url

	const activeFilters = state.currentFilters ? Object.keys( state.currentFilters ) : null;

	const getQueryData = useCallback( () => {
		//Get new data from local query if filtering changes ( on add/remove filter)
		dispatch( { type: 'setFilteringState', filteringState: queryClient.getQueryData( [ slug, 'filters' ] ) } );
	}, [ dispatch, slug, queryClient ] );

	useEffect( () => {
		getQueryData();
		if ( state.filteringState?.possibleFilters ) {
			possibleFilters.current = state.filteringState?.possibleFilters;
		}
		if ( state.filteringState?.currentFilters ) {
			dispatch( {
				type: 'setCurrentFilters', currentFilters: state.filteringState?.currentFilters } );
		}
	}, [ getQueryData, state.filteringState ] );

	/* --- FILTERS ADDING FUNCTIONS --- */
	function addFilter( key, value ) {
		if ( value ) {
			dispatch( { type: 'setCurrentFilters', currentFilters: { ...state.currentFilters, [ key ]: value } } );
		}
		if ( ! value ) {
			removeFilters( [ key ] );
		}
	}

	// Checks the type (string or number) of the filter key
	const handleType = ( key, sendCellOptions ) => {
		const cell = initialRow?.getVisibleCells().find( ( cellItem ) => cellItem.column.id === key );
		const cellfilterValMenu = cell?.column.columnDef.filterValMenu;
		if ( cellfilterValMenu ) {
			dispatch( { type: 'setKeyType', keyType: 'menu' } );
			if ( sendCellOptions ) {
				sendCellOptions( cellfilterValMenu );
			}
			return 'menu';
		}

		if ( typeof initialRow?.original[ key ] === 'number' ) {
			dispatch( { type: 'setKeyType', keyType: 'number' } );
			return 'number';
		}

		if ( key === 'lang' ) {
			dispatch( { type: 'setKeyType', keyType: 'lang' } );
			return 'lang';
		}

		dispatch( { type: 'setKeyType', keyType: 'string' } );
		return 'string';
	};

	function handleSaveFilter( filterParams ) {
		const { filterKey, filterOp, filterVal } = filterParams;
		let key = filterKey;
		const op = filterOp;
		const val = filterVal;

		if ( ! key ) {
			key = Object.keys( state.possibleFilters )[ 0 ];
		}

		delete state.possibleFilters[ key ]; // Removes used filter key from the list

		// Saves the list of unused filters
		dispatch( { type: 'possibleFilters', possibleFilters: possibleFilters.current } );

		// Close the edit panel after save
		dispatch( { type: 'toggleEditFilter', editFilter: false } );

		if ( ! op ) {
			addFilter( key, val );
		}

		if ( op ) {
			addFilter( key, { op, val } );
		}

		// Run only once to prevent infinite loop
		runFilter.current = true;
	}
	/* --- END OF FILTERS ADDING FUNCTIONS --- */

	/* --- FILTERS REMOVAL --- */
	function removeFilters( keyArray ) {
		// Gets the list of current filters
		const getFilters = () => {
			const filtersCopy = { ...state.currentFilters };
			keyArray.map( ( key ) => {
				delete filtersCopy[ key ]; // remove called key (as array) from current filters
				return false;
			} );
			return filtersCopy;
		};
		// Save the current list without removed filter
		dispatch( { type: 'setCurrentFilters', currentFilters: getFilters() } );
	}

	function handleRemoveFilter( keysArray ) {
		// One filter removed –  generate list of possible filters in correct order from header
		if ( keysArray?.length === 1 ) {
			const key = keysArray[ 0 ]; // Get only one given filter
			const newHeader = { ...header }; // Create original header (filter list) copy
			const usedFilters = activeFilters.filter( ( k ) => k !== key ); // Filter used keys
			usedFilters.map( ( k ) => {
				delete newHeader[ k ]; // Delete all used filters (except actually removed) from header
				return false;
			} );

			// Store state of the possible filters list without one removed
			dispatch( { type: 'possibleFilters', possibleFilters: newHeader } );
		}

		// If Clear filters button, generate available filter list from scratch
		if ( keysArray?.length > 1 ) {
			dispatch( { type: 'possibleFilters', possibleFilters: { ...header } } );
		}

		removeFilters( keysArray ); // runs the actual removal

		runFilter.current = true;
	}
	/* --- END  OF FILTERS REMOVAL FUNCTIONS --- */

	// Save the all filter values to local query for later use (on component rerender)
	if ( runFilter.current ) {
		runFilter.current = false;
		queryClient.setQueryData( [ slug, 'filters' ], { filters, currentFilters: state.currentFilters, possibleFilters: possibleFilters.current } );
	}

	return { filters, currentFilters: state.currentFilters, filteringState: state.filteringState, addFilter, removeFilters, state, dispatch, handleType, handleSaveFilter, handleRemoveFilter };
}

/* SORTING HOOK */
export function useSorting( { slug } ) {
	const [ sortingColumn, setSortingColumn ] = useState( '' );
	const queryClient = useQueryClient();

	function sortBy( key ) {
		queryClient.setQueryData( [ slug, 'sortBy' ], key );
		setSortingColumn( `&sort_column=${ key.replace( /(&ASC|&DESC)/, '' ) }&sort_direction=${ key.replace( /\w+&(ASC|DESC)/, '$1' ) }` );
	}

	return { sortingColumn, sortBy };
}
