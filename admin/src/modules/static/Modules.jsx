import { memo } from 'react';
import useModuleGroups from '../../hooks/useModuleGroups';
import useModulesQuery from '../../queries/useModulesQuery';
import labelsList from '../../lib/labelsList';

import DashboardModule from '../../components/DashboardModule';

function Modules() {
	const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();
	const activeGroup = useModuleGroups( ( state ) => state.activeGroup );

	return ( ( isSuccessModules && modules && Object.values( modules ).length ) &&
		<>
			<div className="urlslab-modules flex-tablet-landscape flex-wrap">
				{
					Object.values( modules ).map( ( module ) => {
						return (
							module.id !== 'general' && Object.keys( module.group )[ 0 ] === activeGroup.key
								? <DashboardModule key={ module.id } module={ module } labelsList={ labelsList } />
								: null
						);
					} )
				}
			</div>
		</>
	);
}

export default memo( Modules );
