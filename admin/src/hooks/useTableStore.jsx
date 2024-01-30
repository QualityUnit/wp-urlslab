import { create } from 'zustand';

const activeTable = '';
const tables = {};

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
} ) );

export default useTableStore;
