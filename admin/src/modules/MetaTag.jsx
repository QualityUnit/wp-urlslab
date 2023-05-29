import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import MetaTagOverview from '../overview/MetaTag';
import ModuleViewHeader from '../components/ModuleViewHeader';

const MetaTagsTable = lazy( () => import( `../tables/MetaTagsTable.jsx` ) );
const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

export default function MetaTag( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const slug = 'metatag';

	const tableMenu = new Map( [
		[ slug, __( 'Meta tags' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<MetaTagOverview moduleId={ moduleId } />
			}
			{
				activeSection === slug &&
				<Suspense>
					<MetaTagsTable slug={ slug } />
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
