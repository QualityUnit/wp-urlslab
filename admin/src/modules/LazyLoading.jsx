import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import TableViewHeader from '../components/TableViewHeader';
import YouTubeCacheTable from '../tables/YouTubeCacheTable';
import CSSCacheTable from '../tables/CSSCacheTable';
import ContentCacheTable from '../tables/ContentCacheTable';

export default function LazyLoading( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ 'youtube-cache', __( 'YouTube Cache' ) ],
		[ 'css-cache', __( 'CSS Cache' ) ],
		[ 'content-cache', __( 'Content Cache' ) ],
	]
	);

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const ImportExport = lazy( () => import( `../components/ImportExport.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<TableViewHeader tableMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'youtube-cache' &&
				<YouTubeCacheTable />
			}
			{
				activeSection === 'css-cache' &&
				<CSSCacheTable />
			}
			{
				activeSection === 'content-cache' &&
				<ContentCacheTable />
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
