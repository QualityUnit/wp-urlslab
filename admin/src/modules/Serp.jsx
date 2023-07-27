import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import SerpOverview from '../overview/Serp';
import ModuleViewHeader from '../components/ModuleViewHeader';
import SerpTopDomainsTable from "../tables/SerpTopDomainsTable";

export default function Serp( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const slug = 'serp';

	const tableMenu = new Map( [
		[ 'serp-domains', __( 'Domains' ) ],
		[ 'serp-queries', __( 'Queries' ) ],
	] );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const SerpQueriesTable = lazy( () => import( `../tables/SerpQueriesTable.jsx` ) );
	const SerpTopDomainsTable = lazy( () => import( `../tables/SerpTopDomainsTable.jsx` ) );

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
				activeSection === 'settings' &&
				<Suspense>
					<SettingsModule className="fadeInto" settingId={ moduleId } />
				</Suspense>
			}
		</div>
	);
}
