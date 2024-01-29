import { create } from 'zustand';

const contentGapDefaults = {
	query: '',
	urls: { url_0: '' },
	matching_urls: 5,
	max_position: 10,
	compare_domains: false,
	parse_headers: [ 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
	show_keyword_cluster: false,
	country: 'us',
	ngrams: [ 1, 2, 3, 4, 5 ],
	// data for preprocessing
	processedUrls: {}, // list of processed urls, is used to mark urls status
	forceUrlsProcessing: false, // trigger processing directly as we have passed all data from outside
	processingUrls: false, // flag to show loaders in options and table
	allowUpdateResults: false, // flag to handle displaying of final options submit button which trigger actions for processing and table
	willProcessing: false, // flag to decide if next submit of options require also processing of urls
};

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
	fetchOptions: {},
	contentGapOptions: contentGapDefaults,
	rowToEdit: {},
	otherTableSlug: undefined,
	otherTableRowId: undefined,
	resetPanelsStore: () => {
		set( initialState );
	},
	activatePanel: ( activePanel ) => set( () => ( { activePanel } ) ),
	setOptions: ( options ) => set( ( { options } ) ),
	setFetchOptions: ( fetchOptions ) => set( ( { fetchOptions } ) ),
	setRowToEdit: ( newrowToEdit ) => set( ( state ) => ( { rowToEdit: { ...state.rowToEdit, ...newrowToEdit } } ) ),
	setPanelOverflow: ( panelOverflow ) => set( ( ) => ( { panelOverflow } ) ),
	showSecondPanel: ( secondPanel ) => set( () => ( { secondPanel } ) ),
	setContentGapOptions: ( values ) => set( ( state ) => ( { contentGapOptions: { ...state.contentGapOptions, ...values } } ) ),
} ) );

export default useTablePanels;
