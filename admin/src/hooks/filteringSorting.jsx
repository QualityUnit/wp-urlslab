import { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import filterReducer from '../lib/filterReducer';
import useTableStore from './useTableStore';

const filterObj = {
	filterKey: undefined,
	filterOp: undefined,
	filterVal: undefined,
	filterValMenu: undefined,
	keyType: undefined,
};

export function useFilter( { slug, header } ) {
	const queryClient = useQueryClient();
	const runFilter = useRef( false );
	const initialRow = useTableStore( ( state ) => state.initialRow );
	const setFilters = useTableStore( ( state ) => state.setFilters );
	const [ state, dispatch ] = useReducer( filterReducer, { filters: {}, filteringState: undefined, filterObj, editFilterActive: false } );

	const activefilters = state.filters ? Object.keys( state.filters ) : null;

	const getQueryData = useCallback( () => {
		//Get new data from local query if filtering changes ( on add/remove filter)
		dispatch( { type: 'setFilteringState', filteringState: queryClient.getQueryData( [ slug, 'filters' ] ) } );
	}, [ dispatch, slug, queryClient ] );

	// Recovers filters from query cache when returning from different component
	useEffect( () => {
		getQueryData();
		if ( state.filteringState?.filters ) {
			dispatch( {
				type: 'setFilters', filters: state.filteringState?.filters } );
			setFilters( state.filteringState?.filters );
		}
	}, [ getQueryData, setFilters, state.filteringState ] );

	/* --- filters ADDING FUNCTIONS --- */
	function addFilter( key, value ) {
		if ( value ) {
			dispatch( { type: 'setFilters', filters: { ...state.filters, [ key ]: value } } );
			setFilters( { ...state.filters, [ key ]: value } );
		}
		if ( ! value ) {
			removefilters( [ key ] );
		}
	}

	// Checks the type (string or number) of the filter key
	const handleType = ( keyWithId, sendCellOptions ) => {
		const key = keyWithId?.replace( /(.+?)@\d+/, '$1' );
		const testDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2} ?[0-9]{2}:/g;
		const cell = initialRow?.getAllCells().find( ( cellItem ) => cellItem.column.id === key );
		const cellValue = initialRow?.original[ key ];

		const cellfilterValMenu = cell?.column.columnDef.filterValMenu;
		if ( cellfilterValMenu ) {
			dispatch( { type: 'setKeyType', keyType: 'menu' } );
			dispatch( { type: 'setFilterValMenu', filterValMenu: cellfilterValMenu } );
			if ( sendCellOptions ) {
				sendCellOptions( cellfilterValMenu );
			}
			return cellfilterValMenu;
		}

		if ( testDate.test( cellValue ) ) {
			dispatch( { type: 'setKeyType', keyType: 'date' } );
			return 'date';
		}

		if ( typeof initialRow?.original[ key ] === 'number' ) {
			dispatch( { type: 'setKeyType', keyType: 'number' } );
			return 'number';
		}

		if ( key.includes( 'lang' ) ) {
			dispatch( { type: 'setKeyType', keyType: 'lang' } );
			return 'lang';
		}

		if ( key === 'labels' ) {
			dispatch( { type: 'setKeyType', keyType: 'labels' } );
			return 'labels';
		}

		if ( typeof initialRow?.original[ key ] === 'boolean' ) {
			dispatch( { type: 'setKeyType', keyType: 'boolean' } );
			return 'boolean';
		}

		dispatch( { type: 'setKeyType', keyType: 'string' } );
		return 'string';
	};

	function handleSaveFilter( filterParams ) {
		const { filterKey, filterOp, filterVal, filterValMenu, keyType } = filterParams;
		let key = `${ filterKey }@${ Date.now() }`; // Adding epoch time for unique filter key of column
		const op = filterOp;
		const val = filterVal;

		if ( ! key ) {
			key = Object.keys( header )[ 0 ];
			key = `${ key }@${ Date.now() }`; // Adding epoch time for unique filter key of column
		}

		// Close the edit panel after save
		dispatch( { type: 'toggleEditFilter', editFilter: false } );

		if ( ! op ) {
			addFilter( key, val );
		}

		if ( op ) {
			addFilter( key, { op, val, keyType } );
		}

		if ( op && filterValMenu ) {
			addFilter( key, { op, val, keyType, filterValMenu } );
		}

		// Run only once to prevent infinite loop
		runFilter.current = true;
	}
	/* --- END OF filters ADDING FUNCTIONS --- */

	/* --- filters REMOVAL --- */
	function removefilters( keyArray ) {
		// Gets the list of current filters
		const getfilters = () => {
			const filtersCopy = { ...state.filters };
			keyArray.map( ( key ) => {
				delete filtersCopy[ key ]; // remove called key (as array) from current filters
				return false;
			} );
			return filtersCopy;
		};
		// Save the current list without removed filter
		dispatch( { type: 'setFilters', filters: getfilters() } );
		setFilters( getfilters() );
	}

	function handleRemoveFilter( keysArray ) {
		// One filter removed –  generate list of possible filters in correct order from header
		if ( keysArray?.length === 1 ) {
			const key = keysArray[ 0 ]; // Get only one given filter
			const newHeader = { ...header }; // Create original header (filter list) copy
			const usedfilters = activefilters.filter( ( k ) => k !== key ); // Filter used keys
			usedfilters.map( ( k ) => {
				delete newHeader[ k ]; // Delete all used filters (except actually removed) from header
				return false;
			} );
		}

		removefilters( keysArray ); // runs the actual removal

		runFilter.current = true;
	}
	/* --- END  OF filters REMOVAL FUNCTIONS --- */

	// Save the all filter values to local query for later use (on component rerender)
	if ( runFilter.current ) {
		runFilter.current = false;
		queryClient.setQueryData( [ slug, 'filters' ], { filters: state.filters } );
	}

	return { filters: state.filters || {}, filteringState: state.filteringState, addFilter, removefilters, state, dispatch, handleType, handleSaveFilter, handleRemoveFilter };
}

/* SORTING HOOK */
export function useSorting( { slug } ) {
	const [ sorting, setSorting ] = useState( [] );
	const runSorting = useRef( false );
	const queryClient = useQueryClient();

	const getQueryData = useCallback( () => {
		const sortingQuery = queryClient.getQueryData( [ slug, 'sorting' ] );
		//Get new data from local query if filtering changes ( on add/remove filter)
		if ( sortingQuery ) {
			setSorting( queryClient.getQueryData( [ slug, 'sorting' ] ) );
		}
	}, [ slug, queryClient ] );

	// Recovers filters from query cache when returning from different component
	useEffect( () => {
		getQueryData();
	}, [ getQueryData ] );

	function sortBy( th ) {
		const { header } = th;
		const key = header.id;

		setSorting( ( currentSorting ) => {
			const objFromArr = currentSorting.filter( ( k ) => k.key )[ 0 ];
			const cleanArr = currentSorting.filter( ( k ) => ! k.key );
			if ( objFromArr && objFromArr?.dir === 'ASC' ) {
				return cleanArr;
			}

			if ( objFromArr && objFromArr?.dir === 'DESC' ) {
				return [ { key, dir: 'ASC', op: '>' }, ...cleanArr ];
			}
			return [ { key, dir: 'DESC', op: '<' }, ...currentSorting ];
		}
		);
		runSorting.current = true;
	}

	// Save the all sorting values to local query for later use (on component rerender)
	if ( runSorting.current ) {
		runSorting.current = false;
		queryClient.setQueryData( [ slug, 'sorting' ], sorting );
	}

	return { sorting, sortBy };
}
