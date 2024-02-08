import { create } from 'zustand';

// all defaults, which can be returned as empty object or array define here
// to make sure get actions will return reference stable objects/arrays which do not cause unwanted rerenders
const tables = {};
const filtersDefault = {};
const sortingDefault = [];
const fetchOptionsDefault = {};
const tableDefault = {
	filters: filtersDefault,
	sorting: sortingDefault,
	fetchOptions: fetchOptionsDefault,
	allowCountFetchAbort: false,
	allowTableFetchAbort: false,
};
const activeTable = '';

const useTableStore = create( ( set, get ) => ( {
	tables,
	activeTable,
	resetTableStore: () => {
		set( { activeTable } );
	},
	setActiveTable: ( activeTableSlug ) => set( () => ( { activeTable: activeTableSlug } ) ),
	setSelectedRows: ( selectedRows ) => set( ( ) => ( { selectedRows } ) ),
	setFilters: ( filters, customSlug ) => set( ( state ) => ( { tables: { ...state.tables, [ customSlug ? customSlug : state.activeTable ]: { ...state.tables[ customSlug ? customSlug : state.activeTable ], filters } } } ) ),
	setSorting: ( sorting, customSlug ) => set( ( state ) => ( { tables: { ...state.tables, [ customSlug ? customSlug : state.activeTable ]: { ...state.tables[ customSlug ? customSlug : state.activeTable ], sorting } } } ) ),
	setQueryDetailPanel: ( ( queryDetailPanel ) => set( ( state ) => ( { ...state, queryDetailPanel } ) ) ),
	setUrlDetailPanel: ( ( urlDetailPanel ) => set( ( state ) => ( { ...state, urlDetailPanel } ) ) ),

	// initialize and update table state
	setTable: ( slug, tableStates = {} ) => set( ( state ) => ( {
		...( state.activeTable !== slug ? { activeTable: slug } : null ),
		tables: {
			...state.tables,
			[ slug ]: {
				// use table defaults
				...tableDefault,
				// override defaults with existing
				...state.tables[ slug ],
				// set received updated data
				...tableStates,
			},
		},
	} ) ),
	// get states with reference stable defaults
	useFilters: ( slug ) => get().tables[ slug ? slug : get().activeTable ]?.filters || filtersDefault,
	useSorting: ( slug ) => get().tables[ slug ? slug : get().activeTable ]?.sorting || sortingDefault,
	useFetchOptions: ( slug ) => get().tables[ slug ? slug : get().activeTable ]?.fetchOptions || fetchOptionsDefault,
} ) );

export default useTableStore;
