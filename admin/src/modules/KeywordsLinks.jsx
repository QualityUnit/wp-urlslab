import { useState, Suspense, lazy } from 'react';
import {
	persistQueryClient,
} from '@tanstack/react-query-persist-client';
import { useI18n } from '@wordpress/react-i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import TableViewHeader from '../components/TableViewHeader';
import KeywordsTable from '../tables/KeywordsTable';

export default function KeywordLinks( { moduleId } ) {
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const slug = 'keyword';

	// persistQueryClient( {
	// 	queryClient,
	// 	buster: 'keyword',
	// } );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const ImportExport = lazy( () => import( `../components/ImportExport.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<TableViewHeader slug={ slug } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<KeywordsTable />
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
					<ImportExport
						importOptions={ {
							url: slug,
						} }
						exportOptions={ {
							url: slug,
							fromId: 'from_kw_id',
							pageId: 'kw_id',
							deleteCSVCols: [ 'kw_id', 'destUrlMd5' ],
						} } />
				</Suspense>
			}
		</div>
	);
}
