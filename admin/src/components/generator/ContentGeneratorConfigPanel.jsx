import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Tabs from '@mui/joy/Tabs';
import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import TabPanel from '@mui/joy/TabPanel';

import useAIGenerator from '../../hooks/useAIGenerator';

import ContentGeneratorScalable from './scalable/ContentGeneratorScalable';
import ContentGeneratorManual from './manual/ContentGeneratorManual';

import '../../assets/styles/components/_ContentGeneratorPanel.scss';

function ContentGeneratorConfigPanel( { initialData = {}, useEditor = true, onGenerateComplete, noPromptTemplate, closeBtn, isFloating, className, style } ) {
	const { __ } = useI18n();
	const { aiGeneratorConfig } = useAIGenerator();

	return (
		<div className={ `${ isFloating ? 'urlslab-panel fadeInto urslab-floating-panel urslab-floating-panel__generator floatAtTop urslab-TableFilter-panel' : '' } ${ className || '' }` }
			style={ style }>

			<div className={ `${ isFloating ? 'urlslab-panel-content' : '' }` }>

				{
					aiGeneratorConfig.mode === 'CREATE_POST_WITH_SCALABLE_OPTION' && (
						<>
							<Tabs
								defaultValue="manual"
							>
								<TabList tabFlex="auto">
									<Tab value="manual">{ __( 'Manual AI Generator' ) }</Tab>
									<Tab value="scalable">{ __( 'Scalable AI Generator' ) }</Tab>
								</TabList>
								<TabPanel value="manual">
									<ContentGeneratorManual isFloating={ isFloating } useEditor={ useEditor } noPromptTemplate={ noPromptTemplate } closeBtn={ closeBtn } initialData={ initialData } onGenerateComplete={ onGenerateComplete } />
								</TabPanel>
								<TabPanel value="scalable">
									<ContentGeneratorScalable isFloating={ isFloating } />
								</TabPanel>
							</Tabs>
						</>
					)
				}
			</div>

		</div>
	);
}

export default memo( ContentGeneratorConfigPanel );
