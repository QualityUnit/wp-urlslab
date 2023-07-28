import { useState, Suspense, lazy } from 'react';

import OptimizeOverview from '../overview/Optimize';
import ModuleViewHeader from '../components/ModuleViewHeader';

const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

export default function Optimize() {
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const moduleId = 'optimize';

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<OptimizeOverview moduleId={ moduleId } />
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
