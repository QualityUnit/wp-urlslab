import { create } from 'zustand';

const useModuleGroups = create( ( set ) => ( {
	activeGroup: {},
	setActiveGroup: ( activeGroup ) => set( () => ( { activeGroup } ) ),
} ) );

export default useModuleGroups;
