import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import KeywordLinksOverview from '../overview/KeywordsLinks';
import ModuleViewHeader from '../components/ModuleViewHeader';

const KeywordsTable = lazy( () => import( `../tables/KeywordsTable.jsx` ) );
const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
// const D3WordCloud = lazy( () => import( `../d3/D3WordCloud.jsx` ) );

export default function KeywordLinks() {
	const { __ } = useI18n();
	const slug = 'keyword';
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const moduleId = 'urlslab-keywords-links';

	const tableMenu = new Map( [
		[ slug, __( 'Links' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleId={ moduleId }
				moduleMenu={ tableMenu }
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />

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
