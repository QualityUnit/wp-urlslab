/**
 * Hook to handle title of current page
 */

import { useLocation } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import useModuleDataByRoute from './useModuleDataByRoute';
import { getModuleNameFromRoute } from '../lib/helpers';
import useModuleGroups from './useModuleGroups';

const usePageTitle = () => {
	const { __ } = useI18n();
	const { pathname } = useLocation();
	const { title } = useModuleDataByRoute();

	const groupTitle = useModuleGroups( ( state ) => state.activeGroup.group );

	// routes are not case sensitive, compare route in lowercase to make sure to use correct title for route /Settings and /settigns too
	switch ( getModuleNameFromRoute( pathname ).toLowerCase() ) {
		case '':
			return `${ groupTitle } – ${ __( 'Modules' ) }`;
		case 'settings':
			return __( 'Settings' );
		case 'schedule':
			return __( 'Schedules' );
		case 'tagslabels':
			return __( 'Tags' );
		default:
			// last chance, it's module or unexisting route that leads to root route
			return title || `${ groupTitle } – ${ __( 'Modules' ) }`;
	}
};

export default usePageTitle;
