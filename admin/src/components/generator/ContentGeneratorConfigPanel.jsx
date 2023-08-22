import { InputField } from '../../lib/tableImports';
import { memo, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useAIGenerator from '../../hooks/useAIGenerator';
import '../../assets/styles/components/_ContentGeneratorPanel.scss';
import ContentGeneratorConfigPanelScalable from './ContentGeneratorConfigPanelScalable';
import ContentGeneratorConfigPanelManual from './ContentGeneratorConfigPanelManual';
import ButtonGroup from '../../elements/ButtonGroup';

function ContentGeneratorConfigPanel( { initialData = {}, onGenerateComplete } ) {
	const { __ } = useI18n();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const [ scalableGen, setScalableGen ] = useState( false );

	return (
		<div>

			{
				aiGeneratorConfig.mode === 'WITH_INPUT_VAL' && (
					<div className="urlslab-content-gen-panel-control-item">
						<InputField
							liveUpdate
							defaultValue=""
							description={ __( 'Input Value' ) }
							label={ __( 'Input Value to use in prompt' ) }
							onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, inputValue: val } ) }
							required
						/>
					</div>
				)
			}

			{
				aiGeneratorConfig.mode === 'CREATE_POST_WITH_SCALABLE_OPTION' && (
					<ButtonGroup>
						<button
							className={ ! scalableGen ? 'active' : '' }
							onClick={ () => setScalableGen( false ) }
						>Manual AI Generator</button>
						<button
							className={ scalableGen ? 'active' : '' }
							onClick={ () => setScalableGen( true ) }
						>Scalable AI Generator</button>
					</ButtonGroup>
				)
			}

			{
				! scalableGen && (
					<ContentGeneratorConfigPanelManual initialData={ initialData } onGenerateComplete={ onGenerateComplete } />
				)
			}

			{
				scalableGen && (
					<ContentGeneratorConfigPanelScalable />
				)
			}

		</div>
	);
}

export default memo( ContentGeneratorConfigPanel );
