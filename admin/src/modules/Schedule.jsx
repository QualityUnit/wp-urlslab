import { Suspense, lazy, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import SchedulesOverview from '../overview/Schedules';
import ModuleViewHeader from '../components/ModuleViewHeader';

const SchedulesTable = lazy( () => import( `../tables/SchedulesTable.jsx` ) );
const CreditsTable = lazy( () => import( `../tables/CreditsTable.jsx` ) );
const UsageTable = lazy( () => import( `../tables/UsageTable.jsx` ) );

export default function Schedule() {
	const slug = 'schedule';
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const moduleId = 'urlslab-schedule';

	const tableMenu = new Map( [
		[ slug, __( 'Schedules' ) ],
		[ 'usage', __( 'Daily Usage' ) ],
		[ 'credits', __( 'Recent Transactions' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleId={ moduleId }
				moduleMenu={ tableMenu }
				noSettings
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
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
