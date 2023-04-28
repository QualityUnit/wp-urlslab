import { useState, Suspense, lazy } from 'react';

import Overview from '../components/OverviewTemplate';
import GeneratorOverview from '../overview/Generator';
import ModuleViewHeader from '../components/ModuleViewHeader';
import { useI18n } from '@wordpress/react-i18n';
import GeneratorResultTable from '../tables/GeneratorResultTable';

export default function Generator( { moduleId } ) {
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const { __ } = useI18n();
	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const GeneratorResultTable = lazy( () => import( `../tables/GeneratorResultTable.jsx` ) );
	const tableMenu = new Map( [
		[ 'result', __( 'Generated Results' ) ],
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
				activeSection === 'result' &&
				<Suspense>
					<GeneratorResultTable slug='generator/result' />
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
