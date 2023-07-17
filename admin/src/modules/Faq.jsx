import { useState, Suspense, lazy } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import FaqsOverview from '../overview/Faqs';
import ModuleViewHeader from '../components/ModuleViewHeader';

export default function Faq( { moduleId } ) {
	const { __ } = useI18n();
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	const tableMenu = new Map( [
		[ 'faq', __( 'FAQs' ) ],
	] );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const FaqsTable = lazy( () => import( `../tables/FaqsTable.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
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
				activeSection === 'settings' &&
				<Suspense>
					<SettingsModule className="fadeInto" settingId={ moduleId } />
				</Suspense>
			}
		</div>
	);
}
