import { useState, Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import LinkEnhancerOverview from '../overview/LinkEnhancer';
import ModuleViewHeader from '../components/ModuleViewHeader';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
const LinkManagerTable = lazy( () => import( `../tables/LinkManagerTable.jsx` ) );

export default function LinkEnhancer() {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'url', __( 'URLs' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{ activeSection === 'overview' &&
				<LinkEnhancerOverview moduleId={ moduleId } />
			}
			{
				activeSection === 'url' &&
				<Suspense>
					<LinkManagerTable slug="url" />
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
