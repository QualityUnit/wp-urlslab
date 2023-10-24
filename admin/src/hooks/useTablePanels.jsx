import { create } from 'zustand';

const initialState = {
	secondPanel: undefined,
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
	rowToEdit: {},
	resetPanelsStore: () => {
		set( initialState );
	},
	activatePanel: ( activePanel ) => set( () => ( { activePanel } ) ),
	setOptions: ( options ) => set( ( { options } ) ),
	setFetchOptions: ( fetchOptions ) => set( ( { fetchOptions } ) ),
	setRowToEdit: ( newrowToEdit ) => set( ( state ) => ( { rowToEdit: { ...state.rowToEdit, ...newrowToEdit } } ) ),
	setPanelOverflow: ( panelOverflow ) => set( ( ) => ( { panelOverflow } ) ),
	showSecondPanel: ( secondPanel ) => set( () => ( { secondPanel } ) ),
} ) );

export default useTablePanels;
