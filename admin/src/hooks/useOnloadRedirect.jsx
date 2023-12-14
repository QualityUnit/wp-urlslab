/**
 * Hook to handle onload redirect to last opened page
 */

import { useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { get, update } from 'idb-keyval';
import useModuleGroups from './useModuleGroups';

export const homeRoute = '/SEO&Content';
export const homeTitle = __( 'SEO & Content' );

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
				return { pathname: homeRoute, group: activeGroup.group || homeTitle };
			} );
			navigate( homeRoute );
			return false;
		}

		if ( lastActivePage ) {
			//console.log( 'useOnloadRedirect', lastActivePage?.pathname );
			setActiveGroup( { key: lastActivePage?.pathname?.replace( '/', '' ), group: lastActivePage.group } );
			navigate( lastActivePage.pathname );
		} else {
			setActiveGroup( { key: homeRoute.replace( '/', '' ), group: homeTitle } );
			navigate( homeRoute );
		}
		checkedRedirection.current = true;
	}

	update( 'lastActivePage', () => {
		return { pathname, group: activeGroup.group || homeTitle };
	} );
};

export default useOnloadRedirect;
