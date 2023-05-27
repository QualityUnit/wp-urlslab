import { create } from 'zustand';

const useTablePanels = create( ( set ) => ( {
	panel: {},
	setPanel: ( panelOptions ) => set( () => ( { panel: panelOptions } ) ),
} ) );

export default useTablePanels;
