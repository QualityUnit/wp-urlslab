import { useState, Suspense, lazy } from 'react';

import Overview from '../components/OverviewTemplate';
import GeneratorOverview from '../overview/Generator';
import ModuleViewHeader from '../components/ModuleViewHeader';
import { useI18n } from '@wordpress/react-i18n';

export default function Generator( { moduleId } ) {
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const { __ } = useI18n();
	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const GeneratorTable = lazy( () => import( `../tables/GeneratorTable.jsx` ) );
	const slug = 'content-generator';
	const tableMenu = new Map( [
		[ slug, __( 'Generators' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<Overview moduleId={ moduleId }>
					<GeneratorOverview />
				</Overview>
			}
			{
				activeSection === slug &&
				<Suspense>
					<GeneratorTable slug={ slug } />
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
