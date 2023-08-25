import { InputField } from '../../lib/tableImports';
import { memo, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useAIGenerator from '../../hooks/useAIGenerator';
import '../../assets/styles/components/_ContentGeneratorPanel.scss';
import ContentGeneratorConfigPanelScalable from './ContentGeneratorConfigPanelScalable';
import ContentGeneratorConfigPanelManual from './ContentGeneratorConfigPanelManual';
import ButtonGroup from '../../elements/ButtonGroup';

function ContentGeneratorConfigPanel( { initialData = {}, onGenerateComplete, noPromptTemplate, closeBtn, isFloating, className, style } ) {
	const { __ } = useI18n();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const [ scalableGen, setScalableGen ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( true );

	return (
		<div className={ `${ isFloating ? 'urlslab-panel fadeInto urslab-floating-panel urslab-floating-panel__generator floatAtTop urslab-TableFilter-panel' : '' } ${ className || '' }` }
			style={ style }>

			{
				aiGeneratorConfig.mode === 'WITH_INPUT_VAL' && (
					<div className={ `${ isFloating ? 'urlslab-panel-content' : '' }` }>
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
				aiGeneratorConfig.mode === 'CREATE_POST_WITH_SCALABLE_OPTION' && ! isLoading && (
					<div className={ `${ isFloating ? 'urlslab-panel-content' : '' }` }>
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
					</div>
				)
			}

			{
				! scalableGen && (
					<ContentGeneratorConfigPanelManual isFloating={ isFloating } noPromptTemplate={ noPromptTemplate } closeBtn={ closeBtn }initialData={ initialData } onGenerateComplete={ onGenerateComplete } onInit={ () => setIsLoading( false ) } />
				)
			}

			{
				scalableGen && (
					<ContentGeneratorConfigPanelScalable isFloating={ isFloating } />
				)
			}

		</div>
	);
}

export default memo( ContentGeneratorConfigPanel );
