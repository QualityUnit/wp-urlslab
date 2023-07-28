import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import SearchAndReplaceOverview from '../overview/SearchAndReplace';
import ModuleViewHeader from '../components/ModuleViewHeader';

const SearchReplaceTable = lazy( () => import( `../tables/SearchReplaceTable.jsx` ) );

export default function SearchAndReplace() {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const slug = 'search-replace';

	const moduleId = 'urlslab-search-and-replace';

	const tableMenu = new Map( [
		[ slug, __( 'Replacements' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleId={ moduleId }
				noSettings
				moduleMenu={ tableMenu }
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<SearchAndReplaceOverview moduleId={ moduleId } />
			}
			{
				activeSection === slug &&
				<Suspense>
					<SearchReplaceTable slug={ slug } />
				</Suspense>
			}
		</div>
	);
}
