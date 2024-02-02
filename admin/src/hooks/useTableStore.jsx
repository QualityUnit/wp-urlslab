import { create } from 'zustand';

const activeTable = '';
const tables = {};
const defaultTableStates = {
	filters: {},
	sorting: [],
	fetchOptions: {},
	allowCountFetchAbort: false,
	allowTableFetchAbort: false,
};

const useTableStore = create( ( set ) => ( {
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
		...state,
		...( state.activeTable !== slug ? { activeTable: slug } : null ),
		tables: {
			...state.tables,
			[ slug ]: {
				// use table defaults
				...defaultTableStates,
				// override defaults with existing
				...state.tables[ slug ],
				// set received updated data
				...tableStates,
			},
		},
	} ) ),
} ) );

export default useTableStore;
