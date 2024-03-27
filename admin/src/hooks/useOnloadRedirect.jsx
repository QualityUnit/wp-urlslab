/**
 * Hook to handle onload redirect to last opened page
 */

import { useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { useLocation, useNavigate } from 'react-router-dom';

import useUserLocalData from './useUserLocalData';

export const homeRoute = '/SEO&Content';
export const homeTitle = __( 'SEO & Content' );
const lastActivePageDefault = {};

const useOnloadRedirect = async () => {
	const checkedRedirection = useRef( false );
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const setUserLocalData = useUserLocalData( ( state ) => state.setUserLocalData );
	const getUserLocalData = useUserLocalData( ( state ) => state.getUserLocalData );

	useEffect( () => {
		const lastActivePage = getUserLocalData( 'lastActivePage', lastActivePageDefault );
		const isRootRoute = pathname === '/';

		if ( checkedRedirection.current ) {
			// avoid later access to root path, SEO & Content group is considered as our home dashboard for now
			if ( isRootRoute ) {
				navigate( homeRoute );
				setUserLocalData( 'lastActivePage', { pathname: homeRoute } );
			} else {
				// standard visit of some route, just set last active
				setUserLocalData( 'lastActivePage', { pathname } );
			}
		} else {
			// process onload redirection when app opened on root path, do not redirect when is accessed direct link to some route
			if ( isRootRoute ) {
				if ( typeof lastActivePage === 'object' && lastActivePage && lastActivePage.pathname ) {
					navigate( lastActivePage.pathname );
				} else {
					navigate( homeRoute );
					setUserLocalData( 'lastActivePage', { pathname: homeRoute } );
				}
			} else {
				// direct access of link with route in url
				setUserLocalData( 'lastActivePage', { pathname } );
			}
			checkedRedirection.current = true;
		}
	}, [ navigate, pathname, setUserLocalData, getUserLocalData ] );
};

export default useOnloadRedirect;
