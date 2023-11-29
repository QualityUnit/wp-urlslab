import { create } from 'zustand';

const useModuleGroups = create( ( set ) => ( {
	activeGroup: undefined,
	setActiveGroup: ( activeGroup ) => set( () => ( { activeGroup } ) ),
} ) );

export default useModuleGroups;
