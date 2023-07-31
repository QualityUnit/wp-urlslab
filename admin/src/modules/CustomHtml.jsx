import { useState, Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import ModuleViewHeader from '../components/ModuleViewHeader';
import CustomHtmlOverview from '../overview/CustomHtml';

const CustomHtmlTable = lazy( () => import( `../tables/CustomHtmlTable.jsx` ) );
const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );

export default function CustomHtml() {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'custom-html', __( 'Custom HTML' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
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
