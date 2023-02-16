import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import TableViewHeader from '../components/TableViewHeader';
import LinkManagerTable from '../tables/LinkManagerTable';

export default function LinkEnhancer( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ 'url', __( 'Link Manager Table' ) ],
	] );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<TableViewHeader tableMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'url' &&
				<LinkManagerTable />
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
