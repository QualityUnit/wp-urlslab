import { create } from 'zustand';

const initialState = {
	tableHidden: false,
	table: undefined,
	data: undefined,
	initialRow: undefined,
	selectedRows: [],
	header: {},
	id: undefined,
	slug: undefined,
	title: undefined,
	paginationId: undefined,
	optionalSelector: undefined,
	filters: {},
	sorting: [],
	url: undefined,
};

const useTableStore = create( ( set ) => ( {
	...initialState,
	fetchingStatus: false,
	resetTableStore: () => {
		set( initialState );
	},
	setHiddenTable: ( tableHidden ) => set( () => ( { tableHidden } ) ),
	setTable: ( table ) => set( () => ( { table } ) ),
	setSelectedRows: ( selectedRows ) => set( () => ( { selectedRows } ) ),
	setFilters: ( filters ) => set( () => ( { filters } ) ),
	setSorting: ( sorting ) => set( () => ( { sorting } ) ),
	setFetchingStatus: ( fetchingStatus ) => set( ( ) => ( { fetchingStatus } ) ),
} ) );

export default useTableStore;
