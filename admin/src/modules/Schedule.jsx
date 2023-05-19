import { Suspense, lazy, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Overview from '../components/OverviewTemplate';
import SchedulesOverview from '../overview/Schedules';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function Schedule( { moduleId } ) {
	const slug = 'schedule';
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const SchedulesTable = lazy( () => import( `../tables/SchedulesTable.jsx` ) );
	const CreditsTable = lazy( () => import( `../tables/CreditsTable.jsx` ) );

	const tableMenu = new Map( [
		[ slug, __( 'Schedules' ) ],
		[ 'credits', __( 'Recent Credits' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleMenu={ tableMenu }
				noSettings
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{ activeSection === 'overview' &&
				<Overview moduleId={ moduleId }>
					<SchedulesOverview />
				</Overview>
			}
			{ activeSection === slug &&
				<div className="urlslab-tableView">
					<Suspense>
						<SchedulesTable slug={ slug } />
					</Suspense>
				</div>
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
