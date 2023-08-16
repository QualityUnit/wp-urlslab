import { create } from 'zustand';

const useTablePanels = create( ( set ) => ( {
	activePanel: undefined,
	imageCompare: false,
	options: [],
	rowToEdit: {},
	table: {},
	panelOverflow: false,
	activatePanel: ( activePanel ) => set( () => ( { activePanel } ) ),
	setOptions: ( options ) => set( ( { options } ) ),
	setRowToEdit: ( rowToEdit ) => set( ( { rowToEdit } ) ),
	setTable: ( table ) => set( ( { table } ) ),
	setPanelOverflow: ( panelOverflow ) => set( ( ) => ( { panelOverflow } ) ),
} ) );

export default useTablePanels;
