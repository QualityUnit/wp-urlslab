import { useState, Suspense, lazy } from 'react';

import Overview from '../components/OverviewTemplate';
import CssOptimizerOverview from '../overview/CssOptimizer';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function CssOptimizer( { moduleId } ) {
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<Overview moduleId={ moduleId }>
					<CssOptimizerOverview />
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
