/**
 * Hook to handle onload redirect to last opened page
 */

import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { get, update, del } from 'idb-keyval';
import useModuleGroups from './useModuleGroups';

const useOnloadRedirect = async () => {
	const checkedRedirection = useRef( );
	const { pathname } = useLocation();
	const activeGroup = useModuleGroups( ( state ) => state.activeGroup );
	const setActiveGroup = useModuleGroups( ( state ) => state.setActiveGroup );
	const navigate = useNavigate();

	if ( ! checkedRedirection.current ) {
		const lastActivePage = await get( 'lastActivePage' );

		if ( typeof lastActivePage === 'string' ) {
			update( 'lastActivePage', () => {
				return { pathname: '/SEO&Content', group: activeGroup.group || 'SEO & Content' };
			} );
			navigate( '/SEO&Content' );
			return false;
		}

		if ( lastActivePage ) {
			setActiveGroup( { key: lastActivePage?.pathname?.replace( '/', '' ), group: lastActivePage.group } );
			navigate( lastActivePage.pathname );
		} else {
			setActiveGroup( { key: 'SEO&Content', group: 'SEO & Content' } );
			navigate( '/SEO&Content' );
		}
		checkedRedirection.current = true;
	}

	update( 'lastActivePage', () => {
		return { pathname, group: activeGroup.group || 'SEO & Content' };
	} );
};

export default useOnloadRedirect;
