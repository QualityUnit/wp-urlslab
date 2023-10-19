import { create } from 'zustand';

const useSelectRows = create( ( set ) => ( {
	selectedRows: {},
	setSelectedRows: ( selectedRows ) => set( () => ( { selectedRows } ) ),
} ) );

export default useSelectRows;
