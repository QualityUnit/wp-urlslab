import { useState, Suspense, lazy } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import TableViewHeader from '../components/TableViewHeader';
import YouTubeCacheTable from '../tables/YouTubeCacheTable';

export default function LazyLoading( { moduleId } ) {
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const ImportExport = lazy( () => import( `../components/ImportExport.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<TableViewHeader activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<YouTubeCacheTable />
			}
			{
				activeSection === 'settings' &&
					<Suspense>
						<SettingsModule className="fadeInto" settingId={ moduleId } />
					</Suspense>
			}
			{
				activeSection === 'importexport' &&
				<Suspense>
					<ImportExport exportOptions={ {
						url: 'youtube-cache',
						fromId: 'from_videoid',
						pageId: 'videoid',
					} } />
				</Suspense>
			}
		</div>

	);
}
