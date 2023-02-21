import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import TableViewHeader from '../components/TableViewHeader';

export default function KeywordLinks( { moduleId } ) {
	const { __ } = useI18n();
	const slug = 'keyword';
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ slug, __( 'Keywords Table' ) ],
	] );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const KeywordsTable = lazy( () => import( `../tables/KeywordsTable.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<TableViewHeader
				tableMenu={ tableMenu }
				activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === slug &&
				<Suspense>
					<KeywordsTable slug={ slug } />
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
