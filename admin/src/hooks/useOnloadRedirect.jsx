/**
 * Hook to handle onload redirect to last opened page
 */

import { useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { get, update } from 'idb-keyval';

export const homeRoute = '/SEO&Content';
export const homeTitle = __( 'SEO & Content' );

const useOnloadRedirect = async () => {
	const checkedRedirection = useRef( false );
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const isRootRoute = pathname === '/';

	// avoid later access to root path, SEO & Content group is considered as our home dashboard for now
	if ( checkedRedirection.current && pathname === '/' ) {
		navigate( homeRoute );
	}

	// process onload redirection when app opened on root path, do not redirect when is accessed direct link to some route
	if ( ! checkedRedirection.current && isRootRoute ) {
		const lastActivePage = await get( 'lastActivePage' );

		if ( typeof lastActivePage === 'string' ) {
			update( 'lastActivePage', () => {
				return { pathname: homeRoute };
			} );
			navigate( homeRoute );
			return false;
		}

		if ( lastActivePage && lastActivePage.pathname ) {
			navigate( lastActivePage.pathname );
		} else {
			navigate( homeRoute );
		}
		checkedRedirection.current = true;
	}

	update( 'lastActivePage', () => {
		return { pathname };
	} );
};

export default useOnloadRedirect;
