import { create } from 'zustand';

const initialState = {
	secondPanel: {},
	options: [],
	rowEditorCells: {},
	deleteCSVCols: [],
	panelOverflow: false,
	customSubmitAction: null,
};

const useTablePanels = create( ( set ) => ( {
	...initialState,
	activePanel: undefined,
	actionComplete: false,
	imageCompare: false,
	gapFetchOptions: { urls: { url_0: '', url_1: '', url_2: '', url_3: '' }, matching_urls: 5, max_position: 10, compare_domains: false, parse_headers: false, show_keyword_cluster: false, country: 'us' },
	rowToEdit: {},
	resetPanelsStore: () => {
		set( initialState );
	},
	activatePanel: ( activePanel ) => set( () => ( { activePanel } ) ),
	setOptions: ( options ) => set( ( { options } ) ),
	setGapFetchOptions: ( gapFetchOptions ) => set( ( { gapFetchOptions } ) ),
	setRowToEdit: ( newrowToEdit ) => set( ( state ) => ( { rowToEdit: { ...state.rowToEdit, ...newrowToEdit } } ) ),
	setPanelOverflow: ( panelOverflow ) => set( ( ) => ( { panelOverflow } ) ),
	showSecondPanel: ( secondPanel ) => set( () => ( { secondPanel } ) ),
} ) );

export default useTablePanels;
