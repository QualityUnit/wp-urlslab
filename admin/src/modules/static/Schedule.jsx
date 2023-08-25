import { Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import SchedulesOverview from '../../overview/Schedules';
import ModuleViewHeader from '../../components/ModuleViewHeader';
import useModuleSectionRoute from '../../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../../lib/helpers';

const SchedulesTable = lazy( () => import( `../../tables/SchedulesTable.jsx` ) );
const CreditsTable = lazy( () => import( `../../tables/CreditsTable.jsx` ) );
const UsageTable = lazy( () => import( `../../tables/UsageTable.jsx` ) );

export default function Schedule() {
	const { __ } = useI18n();
	const slug = 'schedule';

	// define module id statically, this module is not included in api response to get value from query
	const moduleId = 'urlslab-schedule';

	const tableMenu = new Map( [
		[ slug, __( 'Schedules' ) ],
		[ 'usage', __( 'Daily Usage' ) ],
		[ 'credits', __( 'Recent Transactions' ) ],
	] );

	const activeSection = useModuleSectionRoute( [
		'overview',
		...getMapKeysArray( tableMenu ),
	], moduleId );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleId={ moduleId }
				moduleMenu={ tableMenu }
				activeSection={ activeSection }
				noSettings
			/>
			{ activeSection === 'overview' &&
			<SchedulesOverview moduleId={ moduleId } />
			}
			{ activeSection === slug &&
				<div className="urlslab-tableView">
					<Suspense>
						<SchedulesTable slug={ slug } />
					</Suspense>
				</div>
			}
			{
				activeSection === 'usage' &&
				<Suspense>
					<UsageTable slug="billing/credits/aggregation" />
				</Suspense>
			}
			{
				activeSection === 'credits' &&
				<Suspense>
					<CreditsTable slug="billing/credits/events" />
				</Suspense>
			}
		</div>
	);
}
