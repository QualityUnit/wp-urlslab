import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import Overview from '../components/OverviewTemplate';
import KeywordLinksOverview from '../overview/KeywordsLinks';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function KeywordLinks( { moduleId } ) {
	const { __ } = useI18n();
	const slug = 'keyword';
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ slug, __( 'Keywords' ) ],
		// [ 'd3-chart', __( 'Word Cloud' ) ],
	] );

	const KeywordsTable = lazy( () => import( `../tables/KeywordsTable.jsx` ) );
	const D3WordCloud = lazy( () => import( `../d3/D3WordCloud.jsx` ) );
	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleMenu={ tableMenu }
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />

			{ activeSection === 'overview' &&
			<Overview moduleId={ moduleId }>
				<KeywordLinksOverview />
			</Overview>
			}
			{
				activeSection === slug &&
				<Suspense>
					<KeywordsTable slug={ slug } />
				</Suspense>
			}
			{ /* {
				activeSection === 'd3-chart' &&
				<Suspense>
					<D3WordCloud slug={ slug } />
				</Suspense>
			} */ }
			{
				activeSection === 'settings' &&
					<Suspense>
						<SettingsModule className="fadeInto" settingId={ moduleId } />
					</Suspense>
			}
		</div>
	);
}
