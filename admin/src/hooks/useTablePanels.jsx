import { create } from 'zustand';

const useTablePanels = create( ( set ) => ( {
	activePanel: undefined,
	secondPanel: undefined,
	actionComplete: false,
	imageCompare: false,
	options: [],
	rowToEdit: {},
	rowEditorCells: {},
	deleteCSVCols: [],
	panelOverflow: false,
	activatePanel: ( activePanel ) => set( () => ( { activePanel } ) ),
	setOptions: ( options ) => set( ( { options } ) ),
	setRowToEdit: ( newrowToEdit ) => set( ( state ) => ( { rowToEdit: { ...state.rowToEdit, ...newrowToEdit } } ) ),
	setPanelOverflow: ( panelOverflow ) => set( ( ) => ( { panelOverflow } ) ),
	showSecondPanel: ( secondPanel ) => set( () => ( { secondPanel } ) ),
} ) );

export default useTablePanels;
