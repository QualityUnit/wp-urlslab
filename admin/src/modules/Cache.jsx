import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import ModuleViewHeader from '../components/ModuleViewHeader';
import CacheOverview from '../overview/Cache';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
const CacheRulesTable = lazy( () => import( `../tables/CacheRulesTable.jsx` ) );

export default function Cache() {
	const { __ } = useI18n();
	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'cache-rules', __( 'Cache Rules' ) ],
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
				<CacheOverview moduleId={ moduleId } />
			}
			{
				activeSection === 'cache-rules' &&
				<Suspense>
					<CacheRulesTable slug={ 'cache-rules' } />
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
