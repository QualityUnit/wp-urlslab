import { useState, Suspense, lazy } from 'react';

import ImageAltAttributeOverview from '../overview/ImageAltAttribute';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function ImageAltAttribute( { moduleId } ) {
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
					<ImageAltAttributeOverview moduleId={ moduleId } />
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
