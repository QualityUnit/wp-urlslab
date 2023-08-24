import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import LazyLoadingOverview from '../overview/LazyLoading';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
const YouTubeCacheTable = lazy( () => import( `../tables/YouTubeCacheTable.jsx` ) );
const ContentCacheTable = lazy( () => import( `../tables/ContentCacheTable.jsx` ) );

export default function LazyLoading() {
	const { __ } = useI18n();
	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'youtube-cache', __( 'YouTube Videos' ) ],
		[ 'content-cache', __( 'Content Lazy Loading' ) ],
	] );

	const activeSection = useModuleSectionRoute( [
		'overview',
		'settings',
		...getMapKeysArray( tableMenu ),
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				moduleMenu={ tableMenu }
				activeSection={ activeSection }
			/>
			{ activeSection === 'overview' &&
			<LazyLoadingOverview moduleId={ moduleId } />
			}
			<Suspense>
				{
					activeSection === 'youtube-cache' &&
					<YouTubeCacheTable slug="youtube-cache" />
				}
				{
					activeSection === 'content-cache' &&
					<ContentCacheTable slug="content-cache" />
				}
			</Suspense>
			{
				activeSection === 'settings' &&
					<Suspense>
						<SettingsModule className="fadeInto" settingId={ moduleId } />
					</Suspense>
			}
		</div>

	);
}
