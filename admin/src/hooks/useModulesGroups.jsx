import { useMemo } from 'react';
import useModulesQuery from '../queries/useModulesQuery';

const useModulesGroups = () => {
	const { data: modules = {} } = useModulesQuery();
	return useMemo( () => {
		const groups = {};
		if ( Object.keys( modules ).length ) {
			for ( const m in modules ) {
				const module = modules[ m ];
				if ( module.id !== 'general' && module.group ) {
					const groupKey = Object.keys( module.group )[ 0 ];
					const groupName = module.group[ groupKey ];
					groups[ groupKey ] = groupName;
				}
			}
		}
		return groups;
	}, [ modules ] );
};

export default useModulesGroups;
