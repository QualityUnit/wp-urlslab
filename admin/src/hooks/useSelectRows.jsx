import { create } from 'zustand';

const useSelectRows = create( ( set ) => ( {
	selectedRows: {},
	selectedAll: {},
	setSelectedRows: ( selectedRows ) => set( ( ) => ( { selectedRows } ) ),
	setSelectedAll: ( slug, selected = true ) => set( ( state ) => ( { selectedAll: { ...state.selectedAll, [ slug ]: selected } } ) ),
	deselectAllRows: ( slug ) => set( ( state ) => {
		if ( slug ) {
			return { ...state, selectedRows: { ...state.selectedRows, [ slug ]: {} }, selectedAll: { ...state.selectedAll, [ slug ]: false } };
		}
		return { ...state, selectedRows: {}, selectedAll: {} };
	} ),
} ) );

export default useSelectRows;
