import { Suspense, lazy, memo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import SerpOverview from '../overview/Serp';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';
import useTableStore from '../hooks/useTableStore.jsx';

const SettingsModule = lazy( () => import( `../modules/static/Settings.jsx` ) );
const SerpQueriesTable = lazy( () => import( `../tables/SerpQueriesTable.jsx` ) );
const QueryDetailPanel = lazy( () => import( '../components/detailsPanel/QueryDetailPanel' ) );
const SerpUrlsTable = lazy( () => import( `../tables/SerpUrlsTable.jsx` ) );
const UrlDetailPanel = lazy( () => import( '../components/detailsPanel/UrlDetailPanel.jsx' ) );
const SerpTopDomainsTable = lazy( () => import( `../tables/SerpTopDomainsTable.jsx` ) );
const SerpCompetitorsTable = lazy( () => import( `../tables/SerpCompetitorsTable.jsx` ) );
const GscSitesTable = lazy( () => import( `../tables/GscSitesTable.jsx` ) );
const SerpContentGapTable = lazy( () => import( `../tables/SerpContentGapTable.jsx` ) );

export default function Serp() {
	const { __ } = useI18n();
	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'serp-queries', __( 'Queries', 'wp-urlslab' ) ],
		[ 'serp-gap', __( 'Content Gap', 'wp-urlslab' ) ],
		[ 'serp-urls', __( 'URLs', 'wp-urlslab' ) ],
		[ 'serp-domains', __( 'Domains', 'wp-urlslab' ) ],
		[ 'serp-competitors', __( 'Competitors', 'wp-urlslab' ) ],
		[ 'gsc-sites', __( 'Google Search Console Sites', 'wp-urlslab' ) ],
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
			{
				activeSection === 'overview' &&
				<SerpOverview moduleId={ moduleId } />
			}
			{
				activeSection === 'gsc-sites' &&
				<Suspense>
					<GscSitesTable slug={ 'gsc-sites' } />
				</Suspense>
			}
			{
				activeSection === 'serp-domains' &&
				<Suspense>
					<SerpTopDomainsTable slug={ 'serp-domains' } />
				</Suspense>
			}
			{
				activeSection === 'serp-competitors' &&
				<Suspense>
					<SerpCompetitorsTable slug={ 'serp-competitors' } />
				</Suspense>
			}
			{
				activeSection === 'serp-queries' &&
					<SerpQueries />
			}
			{
				activeSection === 'serp-urls' &&
					<SerpUrls />
			}
			{
				activeSection === 'serp-gap' &&
				<Suspense>
					<SerpContentGapTable slug={ 'serp-gap' } />
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

const SerpQueries = memo( () => {
	const queryDetailPanel = useTableStore( ( state ) => state.queryDetailPanel );

	return (
		! queryDetailPanel
			? <Suspense>
				<SerpQueriesTable />
			</Suspense>
			: <Suspense>
				<QueryDetailPanel />
			</Suspense>
	);
} );

const SerpUrls = memo( () => {
	const urlDetailPanel = useTableStore( ( state ) => state.urlDetailPanel );

	return (
		! urlDetailPanel
			? <Suspense>
				<SerpUrlsTable slug={ 'serp-urls' } />
			</Suspense>
			: <Suspense>
				<UrlDetailPanel />
			</Suspense>
	);
} );
