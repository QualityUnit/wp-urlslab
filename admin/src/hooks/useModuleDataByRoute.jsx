/**
 * Hook to get module data by the route path
 */

import { useLocation } from 'react-router-dom';

import { getModuleNameFromRoute, renameModule } from '../lib/helpers';
import useModulesQuery from '../queries/useModulesQuery';

const useModuleDataByRoute = () => {
	const { data: modules } = useModulesQuery();
	const location = useLocation();
	let moduleData = {};

	if ( modules && Object.values( modules ).length ) {
		const moduleName = getModuleNameFromRoute( location.pathname );

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
