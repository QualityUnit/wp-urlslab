import { create } from 'zustand';

const initialState = {
	options: [],
	rowToEdit: {},
	rowEditorCells: {},
	deleteCSVCols: [],
	panelOverflow: false,
};

const useTablePanels = create( ( set ) => ( {
	...initialState,
	activePanel: undefined,
	secondPanel: undefined,
	actionComplete: false,
	imageCompare: false,
	resetPanelsStore: () => {
		set( initialState );
	},
	activatePanel: ( activePanel ) => set( () => ( { activePanel } ) ),
	setOptions: ( options ) => set( ( { options } ) ),
	setRowToEdit: ( newrowToEdit ) => set( ( state ) => ( { rowToEdit: { ...state.rowToEdit, ...newrowToEdit } } ) ),
	setPanelOverflow: ( panelOverflow ) => set( ( ) => ( { panelOverflow } ) ),
	showSecondPanel: ( secondPanel ) => set( () => ( { secondPanel } ) ),
} ) );

export default useTablePanels;
