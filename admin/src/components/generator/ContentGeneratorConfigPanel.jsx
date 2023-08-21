import { InputField, SingleSelectMenu, SuggestInputField } from '../../lib/tableImports';
import Checkbox from '../../elements/Checkbox';
import EditableList from '../../elements/EditableList';
import { postFetch } from '../../api/fetching';
import { fetchLangs } from '../../api/fetchLangs';
import TextAreaEditable from '../../elements/TextAreaEditable';
import Button from '../../elements/Button';
import Loader from '../Loader';
import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useAIGenerator, {
	contextTypePromptPlaceholder,
	contextTypes,
	contextTypesDescription,
} from '../../hooks/useAIGenerator';
import '../../assets/styles/components/_ContentGeneratorPanel.scss';
import EditRowPanel from '../EditRowPanel';

function ContentGeneratorConfigPanel( { initialData = {}, onGenerateComplete } ) {
	const { __ } = useI18n();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();

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
				aiGeneratorConfig.mode === 'CREATE_POST' && (
					<div className="urlslab-content-gen-panel-control-item">
						<InputField
							liveUpdate
							defaultValue=""
							description={ __( 'Page Title' ) }
							label={ __( 'Title' ) }
							onChange={ ( title ) => setAIGeneratorConfig( { ...aiGeneratorConfig, title } ) }
							required
						/>
					</div>
				)
			}

			{
				aiGeneratorConfig.mode === 'CREATE_POST' && (
					<div className="urlslab-content-gen-panel-control-item">
						<InputField
							liveUpdate
							key={ aiGeneratorConfig.keywordsList }
							defaultValue={ aiGeneratorConfig.keywordsList.length > 0 ? aiGeneratorConfig.keywordsList[ 0 ].q : '' }
							description={ __( 'Keyword to Pick' ) }
							label={ __( 'Keyword' ) }
							onChange={ ( val ) => handleChangeKeywordInput( val ) }
							required
						/>
					</div>
				)
			}

			{
				aiGeneratorConfig.keywordsList.length > 0 && <div className="urlslab-content-gen-panel-control-item-list">
					{ aiGeneratorConfig.keywordsList.map( ( keyword, idx ) => {
						return (
							<div key={ keyword.q } >
								<Checkbox
									defaultValue={ keyword.checked }
									onChange={ ( checked ) => handleKeywordsCheckboxCheck( checked, idx ) }
								/> <span>{ keyword.q }</span>
							</div>
						);
					} )
					}
				</div>
			}

			<div className="urlslab-content-gen-panel-control-item">
				<div className="urlslab-content-gen-panel-control-item-desc">
					{ contextTypesDescription[ aiGeneratorConfig.dataSource ] }
				</div>
				<div className="urlslab-content-gen-panel-control-item-selector">
					<SingleSelectMenu
						key={ aiGeneratorConfig.dataSource }
						items={ contextTypes }
						name="context_menu"
						defaultAccept
						autoClose
						defaultValue={ aiGeneratorConfig.dataSource }
						onChange={ handleDataSourceSelection }
					/>
				</div>
			</div>

			{
				aiGeneratorConfig.dataSource && aiGeneratorConfig.dataSource === 'URL_CONTEXT' && (
					<div className="urlslab-content-gen-panel-control-item">
						<div className="urlslab-content-gen-panel-control-item-container">
							<EditableList
								placeholder="URLs to use..."
								itemList={ aiGeneratorConfig.urlsList }
								addItemCallback={ ( item ) => setAIGeneratorConfig( {
									...aiGeneratorConfig,
									urlsList: [ ...aiGeneratorConfig.urlsList, item ],
								} ) }
								removeItemCallback={ ( removingItem ) =>
									setAIGeneratorConfig( {
										...aiGeneratorConfig,
										urlsList: aiGeneratorConfig.urlsList.filter( ( item ) => item !== removingItem ),
									} )
								}
							/>
						</div>
					</div>
				)
			}

			{
				aiGeneratorConfig.dataSource && aiGeneratorConfig.dataSource === 'DOMAIN_CONTEXT' && (
					<div>
						<div className="urlslab-content-gen-panel-control-item">
							<div className="urlslab-content-gen-panel-control-item-container">
								<SuggestInputField
									suggestInput=""
									liveUpdate
									onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, domain: val } ) }
									required
									showInputAsSuggestion={ false }
									description={ __( 'Domain to use' ) }
									postFetchRequest={ async ( val ) => {
										return await postFetch( 'schedule/suggest', {
											count: val.count,
											url: val.input,
										} );
									} }
								/>
							</div>
						</div>
						<div className="urlslab-content-gen-panel-control-item">
							<div className="urlslab-content-gen-panel-control-item-container">
								<InputField
									liveUpdate
									defaultValue=""
									description={ __( 'What piece of data you are looking for in your domain' ) }
									label={ __( 'Semantic Context' ) }
									onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, semanticContext: val } ) }
									required
								/>
							</div>
						</div>
					</div>
				)
			}

			{
				aiGeneratorConfig.dataSource && aiGeneratorConfig.dataSource === 'SERP_CONTEXT' && (
					<div className="urlslab-content-gen-panel-control-item-list">
						{
							aiGeneratorConfig.serpUrlsList.map( ( url, idx ) => {
								return (
									<div key={ url.url_name }>
										<Checkbox
											defaultValue={ false }
											onChange={ ( checked ) => handleSerpUrlCheckboxCheck( checked, idx ) }
										/> <span>{ url.url_name }</span>
									</div>
								);
							} )
						}
					</div>
				)
			}

			<div className="urlslab-content-gen-panel-control-item">
				<div className="urlslab-content-gen-panel-control-item-selector">
					<SingleSelectMenu
						key={ aiGeneratorConfig.lang }
						items={ fetchLangs() }
						name="lang_menu"
						defaultAccept
						autoClose
						defaultValue={ aiGeneratorConfig.lang }
						onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, lang: val } ) }
					>{ __( 'Language' ) }</SingleSelectMenu>
				</div>
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				<div className="urlslab-content-gen-panel-control-item-selector">
					{
						promptTemplatesSuccess && (
							<SingleSelectMenu
								autoClose
								defaultValue={ internalState.templateName }
								key={ internalState.templateName }
								items={ { ...Object.keys( allPromptTemplates ).reduce( ( acc, key ) => {
									acc[ key ] = allPromptTemplates[ key ].template_name;
									return acc;
								}, {} ), Custom: 'Custom' } }
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
					description={ __( 'Prompt Template to be used while generating content. supported variables are {keywords}, {primary_keyword}, {title}, {language}' ) } />
			</div>
			<div className="urlslab-content-gen-panel-control-multi-btn">
				<Button onClick={ () => setInternalState( { ...internalState, showPrompt: ! internalState.showPrompt } ) }>{ internalState.showPrompt ? __( 'Hide Prompt' ) : __( 'Show Prompt' ) }</Button>
				{
					internalState.templateName === 'Custom' && promptVal !== '' && (
						<div>
							<Button onClick={ handleSavePromptTemplate }>{ __( 'Save Template' ) }</Button>
						</div>
					)
				}
			</div>
			{
				internalState.showPrompt && (
					<div className="urlslab-content-gen-panel-control-item">
						<TextAreaEditable
							liveUpdate
							val={ promptVal }
							label={ __( 'Prompt' ) }
							rows={ 5 }
							readonly
							description={ __( 'Prompt to be used' ) } />
					</div>
				)
			}

			<div className="urlslab-content-gen-panel-control-item">
				<SingleSelectMenu
					key={ aiGeneratorConfig.modelName }
					items={ aiModelsSuccess ? aiModels : {} }
					name="mode_name_menu"
					defaultAccept
					autoClose
					defaultValue={ aiGeneratorConfig.modelName }
					onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, modelName: val } ) }
				/>
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				<Button active onClick={ handleGenerateContent }>
					{
						internalState.isGenerating ? ( <Loader /> ) : __( 'Generate Text' )
					}
				</Button>
			</div>

			{
				internalState.addPromptTemplate && (
					<EditRowPanel slug="prompt-template" rowEditorCells={ rowEditorCells } rowToEdit={ rowToEdit } title="Add Prompt Template" handlePanel={ () => setInternalState( { ...internalState, addPromptTemplate: false } ) }
					/>
				)
			}

		</div>
	);
}

export default memo( ContentGeneratorConfigPanel );
