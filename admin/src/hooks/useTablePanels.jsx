import { create } from 'zustand';

const useTablePanels = create( ( set ) => ( {
	activePanel: undefined,
	options: {},
	rowToEdit: {},
	activatePanel: ( activePanel ) => set( () => ( { activePanel } ) ),
	setOptions: ( options ) => set( ( { options } ) ),
	setRowToEdit: ( rowToEdit ) => set( ( { rowToEdit } ) ),
} ) );

export default useTablePanels;
