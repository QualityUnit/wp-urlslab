import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import RelatedResourcesOverview from '../overview/RelatedResources';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
const URLRelationTable = lazy( () => import( `../tables/URLRelationTable.jsx` ) );

export default function RelatedResources() {
	const { __ } = useI18n();
	const { moduleId } = useOutletContext();
	const slug = 'url-relation';

	const tableMenu = new Map( [
		[ 'url-relation', __( 'Related Articles' ) ],
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
			<RelatedResourcesOverview moduleId={ moduleId } />
			}
			{
				activeSection === 'url-relation' &&
				<Suspense>
					<URLRelationTable slug={ slug } />
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
