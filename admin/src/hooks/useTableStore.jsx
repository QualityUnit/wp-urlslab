import { create } from 'zustand';

const activeTable = '';
const tables = {};

const useTableStore = create( ( set ) => ( {
	tables,
	activeTable,
	resetTableStore: () => {
		// set( { tables } );
		// set( { activeTable } );
	},
	setActiveTable: ( activeTableSlug ) => set( () => ( { activeTable: activeTableSlug } ) ),
	setHiddenTable: ( tableHidden ) => set( ( state ) => ( { tables: { ...state.tables, [ state.activeTable ]: { ...state.tables[ state.activeTable ], tableHidden } } } ) ),
	setTable: ( table ) => set( ( state ) => ( { tables: { ...state.tables, [ state.activeTable ]: { ...state.tables[ state.activeTable ], table } } } ) ),
	setSelectedRows: ( selectedRows ) => set( ( state ) => ( { tables: { ...state.tables, [ state.activeTable ]: { ...state.tables[ state.activeTable ], selectedRows } } } ) ),
	setFilters: ( filters ) => set( ( state ) => ( { tables: { ...state.tables, [ state.activeTable ]: { ...state.tables[ state.activeTable ], filters } } } ) ),
	setSorting: ( sorting ) => set( ( state ) => ( { tables: { ...state.tables, [ state.activeTable ]: { ...state.tables[ state.activeTable ], sorting } } } ) ),
} ) );

export default useTableStore;
