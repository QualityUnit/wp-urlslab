import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import HtmlOptimizerOverview from '../overview/HtmlOptimizer';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const CSSCacheTable = lazy( () => import( `../tables/CSSCacheTable.jsx` ) );
const JSCacheTable = lazy( () => import( `../tables/JSCacheTable.jsx` ) );
const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );

export default function CssOptimizer() {
	const { __ } = useI18n();
	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'css-cache', __( 'CSS Files' ) ],
		[ 'js-cache', __( 'JavaScript Files' ) ],
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
