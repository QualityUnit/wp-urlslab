import { useState, Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import RedirectsOverview from '../overview/Redirects';
import ModuleViewHeader from '../components/ModuleViewHeader';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
const NotFoundTable = lazy( () => import( `../tables/NotFoundTable.jsx` ) );
const RedirectsTable = lazy( () => import( `../tables/RedirectsTable.jsx` ) );

export default function Redirects() {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'redirects', __( 'Redirects' ) ],
		[ 'notfound', __( '404 Monitor' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{ activeSection === 'overview' &&
			<RedirectsOverview moduleId={ moduleId } />
			}
			{
				activeSection === 'redirects' &&
					<Suspense>
						<RedirectsTable slug={ 'redirects' } />
					</Suspense>
			}
			{
				activeSection === 'notfound' &&
				<Suspense>
					<NotFoundTable slug={ 'not-found-log' } />
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
