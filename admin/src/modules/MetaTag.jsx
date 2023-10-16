import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import MetaTagOverview from '../overview/MetaTag';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const MetaTagsTable = lazy( () => import( `../tables/MetaTagsTable.jsx` ) );
const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );

export default function MetaTag() {
	const { __ } = useI18n();
	const { moduleId } = useOutletContext();
	const slug = 'metatag';

	const tableMenu = new Map( [
		[ slug, __( 'Meta tags' ) ],
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
				<MetaTagOverview moduleId={ moduleId } />
			}
			{
				activeSection === slug &&
				<Suspense>
					<MetaTagsTable slug={ slug } />
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
