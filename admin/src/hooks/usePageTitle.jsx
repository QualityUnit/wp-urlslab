/**
 * Hook to handle title of current page
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';
import { get } from 'idb-keyval';

import useModuleDataByRoute from './useModuleDataByRoute';
import { getModuleNameFromRoute } from '../lib/helpers';

const usePageTitle = () => {
	const { __ } = useI18n();
	const { pathname, state } = useLocation();
	const { title } = useModuleDataByRoute();
	const [ group, setGroup ] = useState( state?.group );

	useEffect( () => {
		if ( ! group ) {
			get( 'lastActivePage' ).then( ( obj ) => setGroup( obj.group ) );
		}
	}, [ group ] );

	// routes are not case sensitive, compare route in lowercase to make sure to use correct title for route /Settings and /settigns too
	switch ( getModuleNameFromRoute( pathname ).toLowerCase() ) {
		case '':
			return `${ group } – ${ __( 'Modules' ) }`;
		case 'settings':
			return __( 'Settings' );
		case 'schedule':
			return __( 'Schedules' );
		case 'tagslabels':
			return __( 'Tags' );
		default:
			// last chance, it's module or unexisting route that leads to root route
			return title || `${ group } – ${ __( 'Modules' ) }`;
	}
};

export default usePageTitle;
