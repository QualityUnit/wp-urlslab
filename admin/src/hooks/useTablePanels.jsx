import { create } from 'zustand';

const useTablePanels = create( ( set ) => ( {
	activePanel: undefined,
	imageCompare: false,
	options: [],
	rowToEdit: {},
	table: {},
	activatePanel: ( activePanel ) => set( () => ( { activePanel } ) ),
	setOptions: ( options ) => set( ( { options } ) ),
	setRowToEdit: ( rowToEdit ) => set( ( { rowToEdit } ) ),
	setTable: ( table ) => set( ( { table } ) ),
} ) );

export default useTablePanels;
