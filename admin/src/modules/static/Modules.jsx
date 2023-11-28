import { memo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { get } from 'idb-keyval';
import useModulesQuery from '../../queries/useModulesQuery';
import labelsList from '../../lib/labelsList';

import DashboardModule from '../../components/DashboardModule';
import useOnloadRedirect from '../../hooks/useOnloadRedirect';

function Modules() {
	useOnloadRedirect();
	const { state } = useLocation();
	const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();
	const [ group, setGroup ] = useState( state?.group );

	useEffect( () => {
		if ( ! group ) {
			get( 'lastActivePage' ).then( ( obj ) => setGroup( obj.group ) );
		}
	}, [ group ] );

	return ( ( isSuccessModules && modules && Object.values( modules ).length ) &&
		<>
			<div className="urlslab-modules flex-tablet-landscape flex-wrap">
				{
					Object.values( modules ).map( ( module ) => {
						return (
							module.id !== 'general' && module.group === group
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
