import { memo, useState } from 'react';
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
	const [ openedGeneratorType, setOpenedGeneratorType ] = useState( 'manual' );

	return (
		<>
			{
				aiGeneratorConfig.mode === 'CREATE_POST_WITH_SCALABLE_OPTION' && (
					<Tabs
						defaultValue={ openedGeneratorType }
						onChange={ ( event, value ) => setOpenedGeneratorType( value ) }
					>
						<TabList tabFlex="auto" size="lg">
							<Tab
								value="manual"
								color={ openedGeneratorType === 'manual' ? 'primary' : 'neutral' }
								disableIndicator
							>
								{ __( 'Manual AI Generator', 'urlslab' ) }
							</Tab>
							<Tab
								value="scalable"
								color={ openedGeneratorType === 'scalable' ? 'primary' : 'neutral' }
								disableIndicator
							>
								{ __( 'Scalable AI Generator', 'urlslab' ) }
							</Tab>
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
