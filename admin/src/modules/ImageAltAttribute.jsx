import { useState, Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';

import ImageAltAttributeOverview from '../overview/ImageAltAttribute';
import ModuleViewHeader from '../components/ModuleViewHeader';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );

export default function ImageAltAttribute() {
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const { moduleId } = useOutletContext();

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
