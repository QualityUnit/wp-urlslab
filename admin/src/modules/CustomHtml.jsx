import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import ModuleViewHeader from '../components/ModuleViewHeader';
import CustomHtmlOverview from '../overview/CustomHtml';

export default function CustomHtml( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ 'custom-html', __( 'Custom HTML' ) ],
	] );

	const CustomHtmlTable = lazy( () => import( `../tables/CustomHtmlTable.jsx` ) );
	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleId={ moduleId }
				moduleMenu={ tableMenu }
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<CustomHtmlOverview moduleId={ moduleId } />
			}
			{
				activeSection === 'custom-html' &&
				<Suspense>
					<CustomHtmlTable slug="custom-html" />
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
