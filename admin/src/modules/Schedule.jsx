import { Suspense, lazy } from 'react';

export default function Schedule( ) {
	const slug = 'schedule';

	const SchedulesTable = lazy( () => import( `../tables/SchedulesTable.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<Suspense>
				<SchedulesTable slug={ slug } />
			</Suspense>
		</div>
	);
}
