import { create } from 'zustand';

const initialState = {
	activePanel: undefined,
	options: {},
};

const useCustomPanel = create( ( set ) => ( {
	...initialState,
	resetCustomPanel: () => {
		set( initialState );
	},
	activatePanel: ( activePanel ) => set( () => ( { activePanel } ) ),
	setOptions: ( options ) => set( () => ( { options } ) ),
} ) );

export default useCustomPanel;
