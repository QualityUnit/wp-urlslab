import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import KeywordLinksOverview from '../overview/KeywordsLinks';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const KeywordsTable = lazy( () => import( `../tables/KeywordsTable.jsx` ) );
const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
// const D3WordCloud = lazy( () => import( `../d3/D3WordCloud.jsx` ) );

export default function KeywordLinks() {
	const { __ } = useI18n();
	const { moduleId } = useOutletContext();
	const slug = 'keyword';

	const tableMenu = new Map( [
		[ slug, __( 'Links' ) ],
	] );

	const activeSection = useModuleSectionRoute( [
		'overview',
		'settings',
		...getMapKeysArray( tableMenu ),
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleId={ moduleId }
				moduleMenu={ tableMenu }
				activeSection={ activeSection }
			/>

			{ activeSection === 'overview' &&
			<KeywordLinksOverview moduleId={ moduleId } />
			}
			{
				activeSection === slug &&
				<Suspense>
					<KeywordsTable slug={ slug } />
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
