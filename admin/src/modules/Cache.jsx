import { useState, Suspense, lazy } from 'react';
import Overview from '../components/OverviewTemplate';
import ModuleViewHeader from '../components/ModuleViewHeader';
import CacheOverview from "../overview/Cache";

export default function Cache( { moduleId } ) {
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<Overview moduleId={ moduleId }>
					<CacheOverview />
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
