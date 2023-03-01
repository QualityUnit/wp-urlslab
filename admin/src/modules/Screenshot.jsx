import { useState, Suspense, lazy } from 'react';

import Overview from '../components/OverviewTemplate';
import ScreenShotOverview from '../overview/Screenshot';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function Screenshot( { moduleId } ) {
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<Overview moduleId={ moduleId }>
					<ScreenShotOverview />
				</Overview>
			}
			{
				activeSection === 'settings' &&
				<Suspense>
					<SettingsModule className="fadeInto" settingId={ moduleId } />
				</Suspense>
			}
		</div>
	);
}
