import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import SearchAndReplaceOverview from '../overview/SearchAndReplace';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const SearchReplaceTable = lazy( () => import( `../tables/SearchReplaceTable.jsx` ) );

export default function SearchAndReplace() {
	const { __ } = useI18n();
	const slug = 'search-replace';
	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ slug, __( 'Replacements' ) ],
	] );

	const activeSection = useModuleSectionRoute( [
		'overview',
		...getMapKeysArray( tableMenu ),
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleId={ moduleId }
				moduleMenu={ tableMenu }
				activeSection={ activeSection }
				noSettings
			/>
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
