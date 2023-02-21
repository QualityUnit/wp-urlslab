import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import TableViewHeader from '../components/TableViewHeader';

export default function RelatedResources( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ 'url-relation', __( 'Relation Links Table' ) ],
	] );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const URLRelationTable = lazy( () => import( `../tables/URLRelationTable.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<TableViewHeader tableMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'url-relation' &&
				<Suspense>
					<URLRelationTable />
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
