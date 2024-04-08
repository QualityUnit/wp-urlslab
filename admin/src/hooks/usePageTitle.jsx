/**
 * Hook to handle title of current page
 */

import { useLocation } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import useModuleDataByRoute from './useModuleDataByRoute';
import useModulesGroups from './useModulesGroups';
import { getModuleNameFromRoute, removeLeadingSlash } from '../lib/helpers';

const usePageTitle = () => {
	const { __ } = useI18n();
	const { pathname } = useLocation();
	const { title } = useModuleDataByRoute();
	const groups = useModulesGroups();
	const groupTitle = groups[ removeLeadingSlash( pathname ) ];

	// routes are not case sensitive, compare route in lowercase and make sure to use correct title for routes ie. /Settings and /settings too
	switch ( getModuleNameFromRoute( pathname ).toLowerCase() ) {
		case 'settings':
			return __( 'Settings' , 'wp-urlslab' );
		case 'schedule':
			return __( 'Schedules' , 'wp-urlslab' );
		case 'tagslabels':
			return __( 'Tags' , 'wp-urlslab' );
		default:
			// last chance, it's module, module group or 404 route that leads to the home route
			return title || ( groupTitle ? `${ groupTitle } – ${ __( 'Modules' , 'wp-urlslab' ) }` : '' );
	}
};

export default usePageTitle;
