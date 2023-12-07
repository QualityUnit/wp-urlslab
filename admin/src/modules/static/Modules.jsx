import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useModuleGroups from '../../hooks/useModuleGroups';
import useModulesQuery from '../../queries/useModulesQuery';
import labelsList from '../../lib/labelsList';

import DashboardModule from '../../components/DashboardModule';
import PaidModulePopup from '../../components/PaidModulePopup';

function Modules() {
	const [ openPopup, setOpenPopup ] = useState( false );
	const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();
	const activeGroup = useModuleGroups( ( state ) => state.activeGroup );
	const navigate = useNavigate();
	return ( ( isSuccessModules && modules && Object.values( modules ).length ) &&
		<>
			<div className="urlslab-modules flex-tablet-landscape flex-wrap">
				{
					Object.values( modules ).map( ( module ) => {
						return (
							module.id !== 'general' && Object.keys( module.group )[ 0 ] === activeGroup.key
								? <DashboardModule key={ module.id } module={ module } labelsList={ labelsList } showPaidModulePopup={ () => setOpenPopup( true ) } />
								: null
						);
					} )
				}
				<PaidModulePopup
					open={ openPopup }
					onClose={ () => setOpenPopup( false ) }
					actionCallback={ () => {
						setOpenPopup( false );
						navigate( '/Settings' );
					} }
				/>
			</div>
		</>
	);
}

export default memo( Modules );
