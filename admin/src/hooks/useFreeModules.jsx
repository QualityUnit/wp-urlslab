/**
 * Hook to get list of free modules from module query
 */

import useModulesQuery from '../queries/useModulesQuery';

const useFreeModules = () => {
	const { data: modules } = useModulesQuery();
	const freeModules = [];

	if ( modules && Object.keys( modules ).length ) {
		for ( const moduleId in modules ) {
			if ( moduleId !== 'general' && modules[ moduleId ].apikey === false ) {
				freeModules.push( moduleId );
			}
		}
	}

	return freeModules;
};

export default useFreeModules;
