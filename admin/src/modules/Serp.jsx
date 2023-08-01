import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import SerpOverview from '../overview/Serp';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function Serp( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ 'serp-domains', __( 'Domains' ) ],
		[ 'gsc-sites', __( 'Google Search Console Sites' ) ],
		[ 'serp-queries', __( 'Queries' ) ],
		[ 'serp-urls', __( 'URLs' ) ],
		[ 'serp-gap', __( 'Content Gap' ) ],
	] );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const SerpQueriesTable = lazy( () => import( `../tables/SerpQueriesTable.jsx` ) );
	const SerpUrlsTable = lazy( () => import( `../tables/SerpUrlsTable.jsx` ) );
	const SerpTopDomainsTable = lazy( () => import( `../tables/SerpTopDomainsTable.jsx` ) );
	const GscSitesTable = lazy( () => import( `../tables/GscSitesTable.jsx` ) );
	const SerpGapTable = lazy( () => import( `../tables/SerpGapTable.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleId={ moduleId }
				moduleMenu={ tableMenu }
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
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
				activeSection === 'serp-gap' &&
				<Suspense>
					<SerpGapTable slug={ 'serp-gap' } />
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
