/**
 * Hook to get module data by the route path
 */

import { useLocation } from 'react-router-dom';

import { renameModule } from '../lib/helpers';
import useModulesQuery from '../queries/useModulesQuery';

const useModuleDataByRoute = () => {
	const { data: modules } = useModulesQuery();
	const location = useLocation();
	const route = location.pathname;

	let moduleData = {};
	if ( modules && Object.values( modules ).length ) {
		const moduleName = route.charAt( 0 ) === '/' ? route.slice( 1 ) : route;
		Object.values( modules ).every( ( module ) => {
			if ( renameModule( module.id ) === moduleName ) {
				moduleData = module;
				return false;
			}
			return true;
		} );
	}

	return moduleData;
};

export default useModuleDataByRoute;
