import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Overview from '../components/OverviewTemplate';
import LazyLoadingOverview from '../overview/LazyLoading';
// eslint-disable-next-line import/no-extraneous-dependencies
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function LazyLoading( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ 'youtube-cache', __( 'YouTube Videos' ) ],
		[ 'content-cache', __( 'Content Lazy Loading' ) ],
	]
	);

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const YouTubeCacheTable = lazy( () => import( `../tables/YouTubeCacheTable.jsx` ) );
	const ContentCacheTable = lazy( () => import( `../tables/ContentCacheTable.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{ activeSection === 'overview' &&
				<Overview moduleId={ moduleId }>
					<LazyLoadingOverview />
				</Overview>
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
