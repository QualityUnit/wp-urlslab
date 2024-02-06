import { useReducer, useCallback, useMemo } from 'react';
import filterReducer from '../lib/filterReducer';
import useTableStore from './useTableStore';
import useSelectRows from './useSelectRows';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

const filterObj = {
	filterKey: undefined,
	filterOp: undefined,
	filterVal: undefined,
	filterValMenu: undefined,
	keyType: undefined,
};

export function useFilter( customSlug, customData ) {
	let slug = useTableStore( ( state ) => state.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}

	const setFilters = useTableStore( ( state ) => state.setFilters );
	const filters = useTableStore().useFilters( slug );
	const deselectAllRows = useSelectRows( ( state ) => state.deselectAllRows );

	const { columnTypes } = useColumnTypesQuery( slug );

	let header = useTableStore( ( state ) => state.tables[ slug ]?.header );
	header = useMemo( () => {
		return ! header && customData?.header
			? customData.header
			: header;
	}, [ customData?.header, header ] );

	const [ state, dispatch ] = useReducer( filterReducer, { filteringState: undefined, filterObj, editFilterActive: false } );

	const activefilters = useMemo( () => filters ? Object.keys( filters ) : null, [ filters ] );

	const dispatchSetFilters = useCallback( ( currentFilters ) => {
		setFilters( currentFilters, slug );
		// clear rows selection
		deselectAllRows( slug );
	}, [ deselectAllRows, setFilters, slug ] );

	/* --- filters REMOVAL --- */
	const removeFilters = useCallback( ( keyArray ) => {
		// Gets the list of current filters
		const getfilters = () => {
			const filtersCopy = { ...filters };
			keyArray.map( ( key ) => {
				delete filtersCopy[ key ]; // remove called key (as array) from current filters
				return false;
			} );
			return filtersCopy;
		};
		// Save the current list without removed filter
		dispatchSetFilters( getfilters() );
	}, [ dispatchSetFilters, filters ] );

	const handleRemoveFilter = useCallback( ( keysArray ) => {
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

		removeFilters( keysArray ); // runs the actual removal
	}, [ activefilters, header, removeFilters ] );
	/* --- END OF filters REMOVAL FUNCTIONS --- */

	/* --- filters ADDING FUNCTIONS --- */
	const addFilter = useCallback( ( key, value ) => {
		if ( value ) {
			dispatchSetFilters( { ...filters, [ key ]: value } );
		}
		if ( ! value ) {
			removeFilters( [ key ] );
		}
	}, [ dispatchSetFilters, filters, removeFilters ] );

	// Checks the type (string or number) of the filter key
	const handleType = useCallback( ( keyWithId, sendCellOptions ) => {
		if ( columnTypes ) {
			const key = keyWithId?.replace( /(.+?)@\d+/, '$1' );
			const column = columnTypes[ key ];

			if ( ! column || ! column?.type ) {
				dispatch( { type: 'setKeyType', keyType: 'string' } );
				return 'string';
			}

			const cellfilterValMenu = ( column?.type === 'menu' || column?.type === 'enum' ) && column?.values;

			if ( column && cellfilterValMenu ) {
				dispatch( { type: 'setKeyType', keyType: 'menu' } );
				dispatch( { type: 'setFilterValMenu', filterValMenu: cellfilterValMenu } );
				if ( sendCellOptions ) {
					sendCellOptions( cellfilterValMenu );
				}
				return cellfilterValMenu;
			}

			dispatch( { type: 'setKeyType', keyType: column?.type !== 'float' ? column?.type : 'number' } );
		}
	}, [ columnTypes ] );

	const createFilterKey = useCallback( ( key ) => {
		if ( ! key ) {
			return Object.keys( header )[ 0 ];
		}
		if ( ! key.includes( `@` ) ) {
			return `${ key }@${ Date.now() }`; // Adding epoch time for unique filter key of column
		}
		return key;
	}, [ header ] );

	const handleSaveFilter = useCallback( ( filterParams ) => {
		const { filterKey, filterOp, filterVal, filterValMenu, keyType } = filterParams;
		const key = createFilterKey( filterKey );
		const op = filterOp;
		const val = filterVal;

		// Close the edit panel after save
		dispatch( { type: 'toggleEditFilter', editFilter: false } );

		if ( ! op ) {
			addFilter( key, val );
		}

		if ( op && ! filterValMenu ) {
			addFilter( key, { op, val, keyType } );
		}

		if ( op && filterValMenu ) {
			addFilter( key, { op, val, keyType, filterValMenu } );
		}
	}, [ addFilter, createFilterKey ] );

	/* --- END OF filters ADDING FUNCTIONS --- */

	// reference stable return object with memoized reference stable methods, to prevent infinite loops when used as hooks dependency
	const returnValues = useMemo( () => (
		{
			state,
			filters, // we can access filters from useFilter hook too, it's table filter state
			filteringState: state.filteringState,
			addFilter,
			removeFilters,
			dispatch,
			handleType,
			handleSaveFilter,
			handleRemoveFilter,
			dispatchSetFilters,
			createFilterKey,
		}
	), [ addFilter, dispatchSetFilters, handleRemoveFilter, handleSaveFilter, handleType, removeFilters, createFilterKey, state, filters ] );

	return returnValues;
}

export function browserFilter( col, params ) {
	const { op, val } = params;
	const isNegative = op !== 'LIKE';
	const browserListArray = val.browser ? [ ...val.browser ] : [ val.bot ];
	const singleBrowser = browserListArray.shift();
	const uniqueBrowser = { col, op: ! isNegative ? op : 'NOTLIKE', val: singleBrowser };
	let allBrowsers = singleBrowser ? [ uniqueBrowser ] : [];

	if ( singleBrowser === 'Chrome' && isNegative ) {
		allBrowsers = [ { col, op: 'NOTLIKE', val: 'Chrome' }, { col, op: 'NOTLIKE', val: 'CriOS' } ];
	}

	if ( singleBrowser === 'Chrome' && ( val.system === 'iOS' || val.system === 'iPad' ) ) {
		allBrowsers = [ { col, op: ! isNegative ? op : 'NOTLIKE', val: 'CriOS' } ];
	}

	if ( singleBrowser === 'Firefox' && ( val.system === 'iOS' || val.system === 'iPad' ) ) {
		allBrowsers = [ { col, op: ! isNegative ? op : 'NOTLIKE', val: 'FxiOS' } ];
	}

	if ( singleBrowser === 'Edge' && ( val.system === 'iOS' || val.system === 'iPad' ) ) {
		allBrowsers = [ { col, op: ! isNegative ? op : 'NOTLIKE', val: 'Edg' } ];
	}

	if ( browserListArray.length && ! isNegative ) {
		browserListArray.map( ( browser ) => {
			return allBrowsers.push( { col, op: 'NOTLIKE', val: browser.replace( '!', '' ) } );
		} );
	}

	if ( val.system === 'Linux' ) {
		return [ ...allBrowsers, { col, op: 'LIKE', val: val.system }, { col, op: 'NOTLIKE', val: 'Android' } ];
	}
	if ( val.system === 'iOS' || val.system === 'iPad' ) {
		return [ ...allBrowsers, { col, op: 'LIKE', val: val.system }, { col, op: 'NOTLIKE', val: 'Macintosh' } ];
	}
	if ( val.system ) {
		return [ ...allBrowsers, { col, op: 'LIKE', val: val.system } ];
	}
	return allBrowsers;
}

export function filtersArray( userFilters ) {
	const arrayOfFilters = userFilters ? Object.entries( userFilters ).map( ( [ column, params ] ) => {
		const { op, val, keyType } = params;
		const col = column.replace( /(.+?)@\d+/, '$1' );
		if ( keyType === 'browser' ) {
			return browserFilter( col, params );
		}
		return { col, op, val };
	} ) : [];

	return arrayOfFilters.flat();
}

export function includesFilter( filtersData, key, operator ) {
	const filters = Array.isArray( filtersData ) ? filtersData : filtersArray( filtersData );
	return filters.filter( ( f ) => {
		if ( operator ) {
			let passedOperator = false;
			if ( Array.isArray( operator ) ) {
				passedOperator = operator.includes( f.op );
			}
			if ( typeof operator === 'string' ) {
				passedOperator = f.op === operator;
			}
			if ( operator === undefined ) {
				passedOperator = true;
			}
			return f.col === key && passedOperator;
		}
		return f.col === key;
	} ).length > 0;
}

export function getFilterVal( filtersData, key, operator ) {
	const filters = Array.isArray( filtersData ) ? filtersData : filtersArray( filtersData );
	const foundItem = filters.find( ( f ) => {
		if ( operator ) {
			return f.col === key && f.op === operator;
		}
		return f.col === key;
	} );
	return foundItem ? foundItem.val : undefined;
}

/* SORTING HOOK */
export function useSorting( customSlug ) {
	let slug = useTableStore( ( state ) => state.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}
	const sorting = useTableStore().useSorting( slug );
	const setSorting = useTableStore( ( state ) => state.setSorting );
	const deselectAllRows = useSelectRows( ( state ) => state.deselectAllRows );

	function sortBy( key ) {
		const objFromArr = sorting.filter( ( k ) => k.key )[ 0 ];
		const cleanArr = sorting.filter( ( k ) => ! k.key );

		// clear rows selection
		deselectAllRows( slug );

		if ( objFromArr && objFromArr?.dir === 'ASC' && objFromArr.key === key ) {
			setSorting( cleanArr, customSlug );
			return false;
		}

		if ( objFromArr && objFromArr?.dir === 'DESC' && objFromArr.key === key ) {
			setSorting( [ { key, dir: 'ASC', op: '>' } ], customSlug );
			return false;
		}
		setSorting( [ { key, dir: 'DESC', op: '<' } ], customSlug );
	}

	return { sortBy };
}

export function sortingArray( tableKey ) {
	const sorting = useTableStore.getState().useSorting( tableKey );

	return sorting ? sorting.map( ( sortingObj ) => {
		const { key, dir } = sortingObj;
		return { col: key, dir };
	} ) : [];
}
