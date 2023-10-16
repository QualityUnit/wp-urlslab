import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import FaqsOverview from '../overview/Faqs';
import ModuleViewHeader from '../components/ModuleViewHeader';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
const FaqsTable = lazy( () => import( `../tables/FaqsTable.jsx` ) );
const FaqUrlsTable = lazy( () => import( `../tables/FaqUrlsTable.jsx` ) );

export default function Faq() {
	const { __ } = useI18n();
	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'faq', __( 'FAQs' ) ],
		[ 'faqurls', __( 'URL Assignment' ) ],
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
			<FaqsOverview moduleId={ moduleId } />
			}
			{
				activeSection === 'faq' &&
					<Suspense>
						<FaqsTable slug={ 'faq' } />
					</Suspense>
			}
			{
				activeSection === 'faqurls' &&
					<Suspense>
						<FaqUrlsTable slug={ 'faqurls' } />
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
