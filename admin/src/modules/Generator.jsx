import { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import GeneratorOverview from '../overview/Generator';
import ModuleViewHeader from '../components/ModuleViewHeader';
import ContentGeneratorPanel from '../components/generator/ContentGeneratorPanel';
import GeneratorPromptTemplateTable from '../tables/GeneratorPromptTemplateTable';
import useModuleSectionRoute from '../hooks/useModuleSectionRoute';
import { getMapKeysArray } from '../lib/helpers';

const SettingsModule = lazy( () => import( `./static/Settings.jsx` ) );
const GeneratorResultTable = lazy( () => import( `../tables/GeneratorResultTable.jsx` ) );
const GeneratorShortcodeTable = lazy( () => import( `../tables/GeneratorShortcodeTable.jsx` ) );

export default function Generator() {
	const { __ } = useI18n();
	const { moduleId } = useOutletContext();

	const tableMenu = new Map( [
		[ 'generator', __( 'Generator' ) ],
		[ 'shortcode', __( 'Shortcodes' ) ],
		[ 'promptTemplate', __( 'Prompt Templates' ) ],
		[ 'result', __( 'Results' ) ],
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
				activeSection === 'settings' &&
				<Suspense>
					<SettingsModule className="fadeInto" settingId={ moduleId } />
				</Suspense>
			}
		</div>
	);
}
