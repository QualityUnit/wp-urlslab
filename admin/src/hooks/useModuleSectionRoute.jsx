/**
 * Hook to handle opened module section by route
 */

import { useOutletContext, useParams } from 'react-router-dom';

import useUserLocalData from './useUserLocalData';

const useModuleSectionRoute = ( availableRoutes, staticId = null ) => {
	const params = useParams();
	const { moduleId } = useOutletContext();

	const isRootRoute = Object.keys( params ).length === 0;
	const currentId = staticId !== null ? staticId : moduleId;
	const activeSectionData = useUserLocalData( ( state ) => state.userData[ currentId ] );

	// accessed directly module route without defined section route
	if ( isRootRoute && activeSectionData && activeSectionData.activeMenu ) {
		return activeSectionData.activeMenu;
	}

	// defined section in route, return if defined section route exists
	if ( params.section && availableRoutes.includes( params.section ) ) {
		return params.section;
	}

	// last chance, show overview also for non existing section routes
	return 'overview';
};

export default useModuleSectionRoute;
