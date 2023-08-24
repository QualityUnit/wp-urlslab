import { useState, Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import GeneratorOverview from '../overview/Generator';
import ModuleViewHeader from '../components/ModuleViewHeader';
import ContentGeneratorPanel from '../components/generator/ContentGeneratorPanel';
import GeneratorPromptTemplateTable from '../tables/GeneratorPromptTemplateTable';
import GeneratorProcessesTable from "../tables/GeneratorProcessesTable";

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
const GeneratorResultTable = lazy( () => import( `../tables/GeneratorResultTable.jsx` ) );
const GeneratorShortcodeTable = lazy( () => import( `../tables/GeneratorShortcodeTable.jsx` ) );

export default function Generator() {
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const { __ } = useI18n();

	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'generator', __( 'Generator' ) ],
		[ 'shortcode', __( 'Shortcodes' ) ],
		[ 'promptTemplate', __( 'Prompt Templates' ) ],
		[ 'result', __( 'Results' ) ],
		[ 'processes', __( 'Running Processes' ) ],
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
				activeSection === 'promptTemplate' &&
				<Suspense>
					<GeneratorPromptTemplateTable slug="prompt-template" />
				</Suspense>
			}
			{
				activeSection === 'result' &&
				<Suspense>
					<GeneratorResultTable slug="generator/result" />
				</Suspense>
			}
			{
				activeSection === 'processes' &&
				<Suspense>
					<GeneratorProcessesTable slug="process/generator-task" />
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
