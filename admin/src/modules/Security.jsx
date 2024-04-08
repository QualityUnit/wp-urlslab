import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import ModuleViewHeader from '../components/ModuleViewHeader';
import SecurityOverview from '../overview/Security';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
const CSPViolationsTable = lazy( () => import( `../tables/CSPViolationsTable.jsx` ) );

export default function Security() {
	const { moduleId } = useOutletContext();
	const { __ } = useI18n();

	const tableMenu = new Map( [
		[ 'security', __( 'CSP Violations Log', 'wp-urlslab' ) ],
	] );

	const activeSection = useModuleSectionRoute( [
		'overview',
		'settings',
		...getMapKeysArray( tableMenu ),
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader
				moduleId={ moduleId }
				moduleMenu={ tableMenu }
				activeSection={ activeSection }
			/>
			{
				activeSection === 'overview' &&
				<SecurityOverview moduleId={ moduleId } />
			}
			{
				activeSection === 'security' &&
				<Suspense>
					<CSPViolationsTable slug={ 'security' } />
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
