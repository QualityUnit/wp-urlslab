/**
 * Hook to handle automatic navigation to module root group page, in case the inactive module route url is accessed directly
 */

import { useNavigate, useLocation } from 'react-router-dom';
import useModulesQuery from '../queries/useModulesQuery';
import { homeRoute } from './useOnloadRedirect';
import { getModuleNameFromRoute, renameModule } from '../lib/helpers';

const useDisabledModuleRedirect = () => {
	const { data: modules = {} } = useModulesQuery();
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const moduleId = getModuleNameFromRoute( pathname );

	let currentModule = null;

	Object.values( modules ).every( ( module ) => {
		if ( renameModule( module.id ).toLowerCase() === moduleId.toLowerCase() ) {
			currentModule = module;
			return false;
		}
		return true;
	} );

	if ( currentModule && ! currentModule.active ) {
		if ( currentModule.group ) {
			const groupRoute = Object.keys( currentModule.group )[ 0 ];
			navigate( groupRoute );
			return;
		}
		// fallback to home if module doesn't have defined group for some reason
		navigate( homeRoute );
	}
};

export default useDisabledModuleRedirect;
