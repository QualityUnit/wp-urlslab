import { create } from 'zustand';
import { get, update } from 'idb-keyval';

const useMainMenuStore = create( ( set ) => ( {
	activePage: 'urlslab-modules',
	setPage: ( activePage ) => set( ( { activePage } ) ),
} ) );

export default function useMainMenu() {
	const activePage = useMainMenuStore( ( state ) => state.activePage );
	const setPage = useMainMenuStore( ( state ) => state.setPage );

	const setActivePage = ( moduleId ) => {
		setPage( moduleId );
		update( 'activePage', () => {
			return moduleId;
		} );
	};

	const getActivePage = async () => {
		const savedPage = await get( 'activePage' );

		if ( savedPage ) {
			setPage( savedPage );
			return savedPage;
		}
		return 'urlslab-modules';
	};

	return { setActivePage, getActivePage, activePage };
}

