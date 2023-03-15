import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Overview from '../components/OverviewTemplate';
import OptimizeOverview from '../overview/Optimize';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function Schedule( { moduleId } ) {
	const { __ } = useI18n();
	// const [activeSection, setActiveSection] = useState('overview');
	const slug = 'schedule';
	const tableMenu = new Map( [
		[ slug, __( 'Schedules' ) ],
	] );

	// const SettingsModule = lazy(() => import(`../modules/Settings.jsx`));
	const SchedulesTable = lazy( () => import( `../tables/SchedulesTable.jsx` ) );

	return (
		<div className="urlslab-tableView">
			{ /* <ModuleViewHeader activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } /> */ }
			{
				// activeSection === 'overview' &&
				// <Overview moduleId={moduleId}>
				//   <OptimizeOverview />
				// </Overview>
			}
			<Suspense>
				<SchedulesTable slug={ slug } />
			</Suspense>
			{ /* {
        activeSection === 'settings' &&
        <Suspense>
          <SettingsModule className="fadeInto" settingId={moduleId} />
        </Suspense>
      } */ }
		</div>
	);
}
