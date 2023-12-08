/**
 * Hook to get list of free modules from module query
 */

import { useMemo } from 'react';
import useModulesQuery from '../queries/useModulesQuery';

const useFreeModules = () => {
	const { data: modules } = useModulesQuery();
	return useMemo( () => {
		const data = [];
		if ( modules && Object.keys( modules ).length ) {
			for ( const moduleId in modules ) {
				if ( moduleId !== 'general' && modules[ moduleId ].apikey === false ) {
					data.push( moduleId );
				}
			}
		}
		return data;
	}, [ modules ] );
};

export default useFreeModules;
