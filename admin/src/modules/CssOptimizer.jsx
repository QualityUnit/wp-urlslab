import { useState, Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import HtmlOptimizerOverview from '../overview/HtmlOptimizer';
import ModuleViewHeader from '../components/ModuleViewHeader';

const CSSCacheTable = lazy( () => import( `../tables/CSSCacheTable.jsx` ) );
const JSCacheTable = lazy( () => import( `../tables/JSCacheTable.jsx` ) );
const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );

export default function CssOptimizer() {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'css-cache', __( 'Cached CSS Files' ) ],
		[ 'js-cache', __( 'Cached JS Files' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<HtmlOptimizerOverview moduleId={ moduleId } />
			}
			<Suspense>
				{
					activeSection === 'css-cache' &&
					<CSSCacheTable slug="css-cache" />
				}
			</Suspense>
			<Suspense>
				{
					activeSection === 'js-cache' &&
					<JSCacheTable slug="js-cache" />
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
