import { useState, Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import MediaOffloaderOverview from '../overview/MediaOffloader';
import ModuleViewHeader from '../components/ModuleViewHeader';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
const MediaFilesTable = lazy( () => import( `../tables/MediaFilesTable.jsx` ) );

export default function MediaOffloader() {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const slug = 'file';

	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ slug, __( 'Media Files' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{ activeSection === 'overview' &&
			<MediaOffloaderOverview moduleId={ moduleId } />
			}
			{
				activeSection === slug &&
				<Suspense>
					<MediaFilesTable slug={ slug } />
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
