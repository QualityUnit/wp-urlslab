/**
 * Hook to handle title of current page
 */

import { useLocation } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import useModulesQuery from '../queries/useModulesQuery';

const usePageTitle = () => {
	const { __ } = useI18n();
	const { data: modules } = useModulesQuery();
	const location = useLocation();
	const route = location.pathname;

	switch ( route ) {
		case '/':
			return __( 'Modules' );
		case '/settings':
			return __( 'Settings' );
		case '/schedule':
			return __( 'Schedules' );
		case '/TagsLabels':
			return __( 'Tags' );
		default:
			// last chance, it's module or unexisting route that leads to root route
			const moduleId = route.charAt( 0 ) === '/' ? route.slice( 1 ) : route;
			return modules && modules[ moduleId ] ? modules[ moduleId ].title : __( 'Modules' );
	}
};

export default usePageTitle;
