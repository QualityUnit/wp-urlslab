import { memo, useState } from 'react';
import Button from '../../elements/Button';
import useAIModelsQuery from '../../queries/useAIModelsQuery';
import usePromptTemplateQuery from '../../queries/usePromptTemplateQuery';
import { useI18n } from '@wordpress/react-i18n';
import useAIGenerator, { contextTypePromptPlaceholder } from '../../hooks/useAIGenerator';
import { SingleSelectMenu } from '../../lib/tableImports';
import TextAreaEditable from '../../elements/TextAreaEditable';
import { useQuery } from '@tanstack/react-query';
import { getPostTypes } from '../../api/generatorApi';
import ImportPanel from '../ImportPanel';
import TextArea from '../../elements/Textarea';

function ContentGeneratorConfigPanelScalable() {
	const { __ } = useI18n();
	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();
	const { data: allPromptTemplates, isSuccess: promptTemplatesSuccess } = usePromptTemplateQuery();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const [ internalState, setInternalState ] = useState( {
		templateName: 'Custom',
		showPrompt: false,
		addPromptTemplate: false,
		postType: 'post',
		showImportPanel: false,
		manualKeywords: [],
	} );

	const postTypesData = useQuery( {
		queryKey: [ 'post_types' ],
		queryFn: async () => {
			const result = await getPostTypes();
			if ( result.ok ) {
				return await result.json();
			}
			return {};
		},
		refetchOnWindowFocus: false,
	} );

	// handling prompt template selection
	const handlePromptTemplateSelection = ( selectedTemplate ) => {
		if ( selectedTemplate ) {
			if ( selectedTemplate === 'Custom' ) {
				setInternalState( { ...internalState, templateName: 'Custom' } );
				return;
			}
			setAIGeneratorConfig( {
				...aiGeneratorConfig,
				promptTemplate: allPromptTemplates[ selectedTemplate ].prompt_template,
			} );
			setInternalState( { ...internalState, templateName: allPromptTemplates[ selectedTemplate ].template_name } );
		}
	};

	// handling save prompt template
	const handleSavePromptTemplate = async () => {
		if ( ! aiGeneratorConfig.promptTemplate ) {
			return;
		}
		setInternalState( { ...internalState, addPromptTemplate: true } );
	};

	return (
		<div>

			<div className="urlslab-content-gen-panel-control-item">
				<SingleSelectMenu
					key={ internalState.postType }
					items={ postTypesData.data }
					name="post_type_menu"
					defaultAccept
					autoClose
					defaultValue={ internalState.postType }
					onChange={ ( val ) => setInternalState( { ...internalState, postType: val } ) }
				>{ __( 'Post Type' ) }</SingleSelectMenu>
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				<SingleSelectMenu
					key={ aiGeneratorConfig.modelName }
					items={ aiModelsSuccess ? aiModels : {} }
					name="mode_name_menu"
					defaultAccept
					autoClose
					defaultValue={ aiGeneratorConfig.modelName }
					onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, modelName: val } ) }
				>{ __( 'AI Model' ) }</SingleSelectMenu>
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				<div className="urlslab-content-gen-panel-control-item-selector">
					{
						promptTemplatesSuccess && (
							<SingleSelectMenu
								autoClose
								defaultValue={ internalState.templateName }
								key={ internalState.templateName }
								items={ {
									...Object.keys( allPromptTemplates ).reduce( ( acc, key ) => {
										acc[ key ] = allPromptTemplates[ key ].template_name;
										return acc;
									}, {} ), Custom: 'Custom',
								} }
								liveUpdate
								onChange={ handlePromptTemplateSelection }
								showInputAsSuggestion={ false }
							>{ __( 'Choose Prompt Template' ) }</SingleSelectMenu>
						)
					}
				</div>
			</div>
			<div className="urlslab-content-gen-panel-control-item">
				<TextAreaEditable
					liveUpdate
					val={ aiGeneratorConfig.promptTemplate }
					defaultValue=""
					label={ __( 'Prompt Template' ) }
					rows={ 15 }
					allowResize
					onChange={ ( promptTemplate ) => {
						setAIGeneratorConfig( { ...aiGeneratorConfig, promptTemplate } );
						if ( internalState.templateName !== 'Custom' ) {
							setInternalState( { ...internalState, templateName: 'Custom' } );
						}
					} }
					required
					placeholder={ contextTypePromptPlaceholder[ aiGeneratorConfig.dataSource ] }
					description={ __( 'Prompt Template to be used while generating content. supported variable is {keyword}' ) } />
			</div>
			<div className="urlslab-content-gen-panel-control-multi-btn">
				{
					internalState.templateName === 'Custom' && aiGeneratorConfig.promptTemplate !== '' && (
						<div>
							<Button onClick={ handleSavePromptTemplate }>{ __( 'Save Template' ) }</Button>
						</div>
					)
				}
			</div>

			<div>
				<h3>Import CSV</h3>
				<p>Import a Csv of keywords to create post from</p>
				<Button active onClick={ () => setInternalState( {
					...internalState,
					showImportPanel: true,
				} ) }>{ __( 'Import Keywords' ) }</Button>
			</div>
			{
				internalState.showImportPanel && (
					<ImportPanel options={ {
						slug: 'process/posts-gen-task',
					} } handlePanel={ () => setInternalState( { ...internalState, showImportPanel: false } ) } />
				)
			}

			or

			<div>
				<h3>Write the Keywords to create post from</h3>
				<TextArea
					key={ internalState.manualKeywords } // hotfix to rerender component after next generating :/
					label={ __( 'Generated text' ) }
					rows={ 11 }
					defaultValue={ internalState.manualKeywords.join( '\n' ) }
					onChange={ ( value ) => setInternalState( { ...internalState, manualKeywords: value.split( '\n' ) } ) }
					liveUpdate
				/>
			</div>
		</div>
	);
}

export default memo( ContentGeneratorConfigPanelScalable );
