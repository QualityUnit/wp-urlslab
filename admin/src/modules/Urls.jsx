import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import UrlsOverview from '../overview/Urls';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
const UrlsTable = lazy( () => import( `../tables/UrlsTable.jsx` ) );
const URLMapTable = lazy( () => import( `../tables/URLMapTable.jsx` ) );

export default function Urls() {
	const { __ } = useI18n();
	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'url', __( 'URLs', 'urlslab' ) ],
		[ 'map', __( 'URLs Connections', 'urlslab' ) ],
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
			{ activeSection === 'overview' &&
				<UrlsOverview moduleId={ moduleId } />
			}
			{
				activeSection === 'url' &&
				<Suspense>
					<UrlsTable slug="url" />
				</Suspense>
			}
			{
				activeSection === 'map' &&
				<Suspense>
					<URLMapTable slug="url-map" />
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
