import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Overview from '../components/OverviewTemplate';
import ScreenShotOverview from '../overview/Screenshot';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function Screenshot( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ 'url', __( 'Screenshots' ) ],
	] );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const ScreenshotTable = lazy( () => import( `../tables/ScreenshotTable.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<Overview moduleId={ moduleId }>
					<ScreenShotOverview />
				</Overview>
			}
			{
				activeSection === 'url' &&
					<Suspense>
						<ScreenshotTable slug="url" />
					</Suspense>
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
