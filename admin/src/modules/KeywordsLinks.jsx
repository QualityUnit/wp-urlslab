import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { __ } from '@wordpress/i18n';

import KeywordLinksOverview from '../overview/KeywordsLinks';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const KeywordsTable = lazy( () => import( `../tables/KeywordsTable.jsx` ) );
const BacklinksTable = lazy( () => import( `../tables/BacklinksTable.jsx` ) );
const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
// const D3WordCloud = lazy( () => import( `../d3/D3WordCloud.jsx` ) );

const slug = 'keyword';
const tableMenu = new Map( [
	[ slug, __( 'Link Building', 'wp-urlslab' ) ],
	[ 'backlinks', __( 'Backlink Monitoring', 'wp-urlslab' ) ],
] );

export default function KeywordLinks() {
	const { moduleId } = useOutletContext();

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
				activeSection === 'backlinks' &&
				<Suspense>
					<BacklinksTable slug={ 'backlinks' } />
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
