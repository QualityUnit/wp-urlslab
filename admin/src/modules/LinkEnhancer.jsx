import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Overview from '../components/OverviewTemplate';
import LinkEnhancerOverview from '../overview/LinkEnhancer';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function LinkEnhancer( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ 'url', __( 'Links' ) ],
	] );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const LinkManagerTable = lazy( () => import( `../tables/LinkManagerTable.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{ activeSection === 'overview' &&
				<Overview moduleId={ moduleId }>
					<LinkEnhancerOverview />
				</Overview>
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
