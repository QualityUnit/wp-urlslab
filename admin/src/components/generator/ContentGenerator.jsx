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

function ContentGenerator( { initialData = {}, useEditor = true, onGenerateComplete, noPromptTemplate } ) {
	const { __ } = useI18n();
	const { aiGeneratorConfig } = useAIGenerator();

	return (
		<>
			{
				aiGeneratorConfig.mode === 'CREATE_POST_WITH_SCALABLE_OPTION' && (
					<Tabs
						defaultValue="manual"
					>
						<TabList tabFlex="auto">
							<Tab value="manual">{ __( 'Manual AI Generator' ) }</Tab>
							<Tab value="scalable">{ __( 'Scalable AI Generator' ) }</Tab>
						</TabList>
						<TabPanel value="manual">
							<ContentGeneratorManual useEditor={ useEditor } noPromptTemplate={ noPromptTemplate } initialData={ initialData } onGenerateComplete={ onGenerateComplete } />
						</TabPanel>
						<TabPanel value="scalable">
							<ContentGeneratorScalable />
						</TabPanel>
					</Tabs>
				)
			}

			{
				initialData.mode === 'QUESTION_ANSWERING' && (
					<ContentGeneratorManual useEditor={ useEditor } noPromptTemplate={ noPromptTemplate } initialData={ initialData } onGenerateComplete={ onGenerateComplete } />
				)
			}
		</>
	);
}

export default memo( ContentGenerator );
