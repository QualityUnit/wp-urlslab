import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import TableViewHeader from '../components/TableViewHeader';
import URLRelationTable from '../tables/URLRelationTable';

export default function RelatedResources( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ 'url-relation', __( 'Relation Links Table' ) ],
	] );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<TableViewHeader tableMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'url-relation' &&
				<URLRelationTable />
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
