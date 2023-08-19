import { create } from 'zustand';

const useTableStore = create( ( set ) => ( {
	fetchingStatus: false,
	tableHidden: false,
	table: undefined,
	initialRow: undefined,
	selectedRows: undefined,
	header: {},
	slug: undefined,
	title: undefined,
	paginationId: undefined,
	optionalSelector: undefined,
	filters: {},
	sorting: [],
	url: undefined,
	setHiddenTable: ( tableHidden ) => set( () => ( { tableHidden } ) ),
	setTable: ( table ) => set( () => ( { table } ) ),
	setFilters: ( filters ) => set( () => ( { filters } ) ),
	setSorting: ( sorting ) => set( () => ( { sorting } ) ),
	setFetchingStatus: () => set( ( state ) => ( { fetchingStatus: ! state.fetchingStatus } ) ),
} ) );

export default useTableStore;
