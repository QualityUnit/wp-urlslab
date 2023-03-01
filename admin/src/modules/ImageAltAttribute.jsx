import { useState, Suspense, lazy } from 'react';

import Overview from '../components/OverviewTemplate';
import ImageAltAttributeOverview from '../overview/ImageAltAttribute';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function ImageAltAttribute( { moduleId } ) {
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<Overview moduleId={ moduleId }>
					<ImageAltAttributeOverview />
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
