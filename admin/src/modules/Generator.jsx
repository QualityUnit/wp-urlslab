import { useState, Suspense, lazy } from 'react';

import GeneratorOverview from '../overview/Generator';
import ModuleViewHeader from '../components/ModuleViewHeader';
import { useI18n } from '@wordpress/react-i18n';
import ContentGeneratorPanel from '../components/generator/ContentGeneratorPanel';

export default function Generator( { moduleId } ) {
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const { __ } = useI18n();
	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );
	const GeneratorResultTable = lazy( () => import( `../tables/GeneratorResultTable.jsx` ) );
	const GeneratorShortcodeTable = lazy( () => import( `../tables/GeneratorShortcodeTable.jsx` ) );
	const tableMenu = new Map( [
		[ 'generator', __( 'Generator' ) ],
		[ 'shortcode', __( 'Shortcodes' ) ],
		[ 'result', __( 'Results' ) ],
	] );

	return (
		<div className="urlslab-tableView">
			<ModuleViewHeader moduleId={ moduleId }
				moduleMenu={ tableMenu } activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<GeneratorOverview moduleId={ moduleId } />
			}
			{
				activeSection === 'generator' &&
				<ContentGeneratorPanel />
			}
			{
				activeSection === 'shortcode' &&
				<Suspense>
					<GeneratorShortcodeTable slug="generator/shortcode" />
				</Suspense>
			}
			{
				activeSection === 'result' &&
				<Suspense>
					<GeneratorResultTable slug="generator/result" />
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
