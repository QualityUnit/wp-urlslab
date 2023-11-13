/**
 * Hook to handle opened module section by route
 */

import { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { get } from 'idb-keyval';

const useModuleSectionRoute = ( availableRoutes, staticId = null ) => {
	const { moduleId } = useOutletContext();

	const [ activeSectionData, setActiveSectionData ] = useState( null );
	const params = useParams();
	const isRootRoute = Object.keys( params ).length === 0;

	// if it's root module route, check for last visited section
	const checkLastVisitedTab = useCallback( async () => {
		if ( isRootRoute ) {
			const savedData = await get( staticId !== null ? staticId : moduleId );
			setActiveSectionData( savedData );
		}
	}, [ isRootRoute, moduleId, staticId ] );

	useEffect( () => {
		checkLastVisitedTab();
	}, [ checkLastVisitedTab ] );

	// accessed directly module route without defined section route
	if ( isRootRoute ) {
		if ( activeSectionData === undefined ) {
			// not saved last visited section, return default
			return 'overview';
		}
		// return null if not fetched yet, prevent showing overview while loading from idb-keyval
		return activeSectionData?.activeMenu ? activeSectionData.activeMenu : null;
	}

	// defined section in route, return if defined section route exists
	if ( params.section && availableRoutes.includes( params.section ) ) {
		return params.section;
	}

	// last chance, show overview also for non existing section routes
	return 'overview';
};

export default useModuleSectionRoute;
