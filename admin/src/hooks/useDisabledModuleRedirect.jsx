/**
 * Hook to handle automatic navigation to root, in case the inactive module route url is accessed directly
 */

import { useNavigate, useLocation } from 'react-router-dom';
import useModulesQuery from '../queries/useModulesQuery';

const useDisabledModuleRedirect = () => {
	const { data: modules = {} } = useModulesQuery();
	const navigate = useNavigate();
	const location = useLocation();
	const routeId = location.pathname.charAt( 0 ) === '/' ? location.pathname.slice( 1 ) : location.pathname;
	let currentModule = null;

	Object.values( modules ).every( ( module ) => {
		if ( module.id === routeId ) {
			currentModule = module;
			return false;
		}
		return true;
	} );

	if ( currentModule && ! currentModule.active ) {
		navigate( '/' );
	}
};

export default useDisabledModuleRedirect;
