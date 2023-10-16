import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';

import ImageAltAttributeOverview from '../overview/ImageAltAttribute';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );

export default function ImageAltAttribute() {
	const { moduleId } = useOutletContext();

	const activeSection = useModuleSectionRoute( [
		'overview',
		'settings',
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleId={ moduleId }
				activeSection={ activeSection }
			/>
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
