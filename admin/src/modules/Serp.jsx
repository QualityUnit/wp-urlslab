import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import SerpOverview from '../overview/Serp';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const SettingsModule = lazy( () => import( `../modules/static/Settings.jsx` ) );
const SerpQueriesTable = lazy( () => import( `../tables/SerpQueriesTable.jsx` ) );
const SerpUrlsTable = lazy( () => import( `../tables/SerpUrlsTable.jsx` ) );
const SerpTopDomainsTable = lazy( () => import( `../tables/SerpTopDomainsTable.jsx` ) );
const SerpCompetitorsTable = lazy( () => import( `../tables/SerpCompetitorsTable.jsx` ) );
const GscSitesTable = lazy( () => import( `../tables/GscSitesTable.jsx` ) );

export default function Serp() {
	const { __ } = useI18n();
	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'serp-domains', __( 'Domains' ) ],
		[ 'serp-competitors', __( 'Competitors' ) ],
		[ 'gsc-sites', __( 'Google Search Console Sites' ) ],
		[ 'serp-queries', __( 'Queries' ) ],
		[ 'serp-urls', __( 'URLs' ) ],
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
				<Suspense>
					<SerpQueriesTable slug={ 'serp-queries' } />
				</Suspense>
			}
			{
				activeSection === 'serp-urls' &&
				<Suspense>
					<SerpUrlsTable slug={ 'serp-urls' } />
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
