import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Overview from '../components/OverviewTemplate';
import SearchAndReplaceOverview from '../overview/SearchAndReplace';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function SearchAndReplace( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const slug = 'search-replace';

	const tableMenu = new Map( [
		[ slug, __( 'Replacements' ) ],
	] );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const SearchReplaceTable = lazy( () => import( `../tables/SearchReplaceTable.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleMenu={ tableMenu }
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<Overview moduleId={ moduleId }>
					<SearchAndReplaceOverview />
				</Overview>
			}
			{
				activeSection === slug &&
				<Suspense>
					<SearchReplaceTable slug={ slug } />
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
