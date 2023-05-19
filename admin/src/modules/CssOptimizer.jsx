import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import CssOptimizerOverview from '../overview/CssOptimizer';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function CssOptimizer( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ 'css-cache', __( 'Cached CSS Files' ) ],
	] );

	const CSSCacheTable = lazy( () => import( `../tables/CSSCacheTable.jsx` ) );
	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<CssOptimizerOverview moduleId={ moduleId } />
			}
			<Suspense>
				{
					activeSection === 'css-cache' &&
					<CSSCacheTable slug="css-cache" />
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
