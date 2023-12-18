import { memo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useModulesQuery from '../../queries/useModulesQuery';
import labelsList from '../../lib/labelsList';
import { removeLeadingSlash } from '../../lib/helpers';

import DashboardModule from '../../components/DashboardModule';
import PaidModulePopup from '../../components/PaidModulePopup';

function Modules() {
	const [ openPopup, setOpenPopup ] = useState( false );
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();

	return ( ( isSuccessModules && modules && Object.values( modules ).length ) &&
		<>
			<div className="urlslab-modules flex-tablet-landscape flex-wrap">
				{
					Object.values( modules ).map( ( module ) => {
						return (
							module.id !== 'general' && Object.keys( module.group )[ 0 ] === removeLeadingSlash( pathname )
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
