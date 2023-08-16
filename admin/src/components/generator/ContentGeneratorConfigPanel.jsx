import { InputField, SingleSelectMenu, SuggestInputField } from '../../lib/tableImports';
import Checkbox from '../../elements/Checkbox';
import EditableList from '../../elements/EditableList';
import { postFetch } from '../../api/fetching';
import { fetchLangs } from '../../api/fetchLangs';
import TextAreaEditable from '../../elements/TextAreaEditable';
import Button from '../../elements/Button';
import Loader from '../Loader';
import { memo, useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useAIGenerator, {
	contextTypePromptPlaceholder,
	contextTypes,
	contextTypesDescription,
} from '../../hooks/useAIGenerator';
import '../../assets/styles/components/_ContentGeneratorPanel.scss';
import {
	generateContent,
	getQueryCluster,
	getTopUrls,
	handleGeneratePrompt,
} from '../../lib/aiGeneratorPanel';
import { getAugmentProcessResult, getPromptTemplates } from '../../api/generatorApi';
import useAIModelsQuery from '../../queries/useAIModelsQuery';
import { setNotification } from '../../hooks/useNotifications';
import EditRowPanel from '../EditRowPanel';
import TextArea from '../../elements/Textarea';
import useTablePanels from '../../hooks/useTablePanels';
import usePromptTemplateQuery from '../../queries/usePromptTemplateQuery';

function ContentGeneratorConfigPanel( { initialData = {}, onGenerateComplete } ) {
	const { __ } = useI18n();

	const { setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();
	const { data: allPromptTemplates, isSuccess: promptTemplatesSuccess } = usePromptTemplateQuery();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const [ typingTimeout, setTypingTimeout ] = useState( 0 );
	const [ internalState, setInternalState ] = useState( {
		isGenerating: false,
		templateName: 'Custom',
		showPrompt: false,
		addPromptTemplate: false,
		promptVal: '',
	} );
	const [ promptVal, setPromptVal ] = useState( '' );

	const rowEditorCells = {
		template_name: <div>
			<InputField liveUpdate defaultValue={ rowToEdit.template_name } label={ __( 'Template Name' ) }
				description={ __( 'Up to 255 characters.' ) }
				onChange={ ( val ) => setRowToEdit( { ...rowToEdit, template_name: val } ) } required />
		</div>,

		prompt_template: <TextArea liveUpdate allowResize rows={ 10 } description={ ( __( 'Prompt Template to use for Generating Text' ) ) } defaultValue={ aiGeneratorConfig.promptTemplate } label={ __( 'Prompt Template' ) } onChange={ ( val ) => {
			setRowToEdit( { ...rowToEdit, prompt_template: val } );
		} } />,

		model_name: <SingleSelectMenu autoClose defaultAccept description={ __( 'AI Model to use with the template' ) } items={ aiModelsSuccess ? aiModels : {} } defaultValue={ aiGeneratorConfig.modelName } name="model" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, model_name: val } ) }>{ __( 'Model' ) }</SingleSelectMenu>,

		prompt_type: <SingleSelectMenu autoClose defaultAccept description={ __( 'The Type of task that the prompt can be used in' ) } items={ {
			G: __( 'For General Tasks' ),
			S: __( 'For Summarization Tasks' ),
			B: __( 'For Blog Generation' ),
			A: __( 'For Question Answering Tasks' ),
		} } defaultValue="G" name="prompt_type" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, prompt_type: val } ) }>{ __( 'Prompt Type ' ) }</SingleSelectMenu>,
	};

	//handling the initial loading with preloaded data
	useEffect( () => {
		// setting initial state
		const initialConf = { ...aiGeneratorConfig, ...initialData };
		setAIGeneratorConfig( initialConf );

		const fetchTopUrls = async () => {
			const topUrls = await getTopUrls( initialConf );
			setAIGeneratorConfig( { ...useAIGenerator.getState().aiGeneratorConfig, serpUrlsList: topUrls } );
		};

		const fetchQueryCluster = async () => {
			const primaryKeyword = aiGeneratorConfig.keywordsList[ 0 ].q;
			const queryCluster = await getQueryCluster( primaryKeyword );
			setAIGeneratorConfig( { ...useAIGenerator.getState().aiGeneratorConfig, keywordsList: [ { q: primaryKeyword, checked: true }, ...queryCluster ] } );
		};

		const getInitialPromptTemplate = async () => {
			const rsp = await getPromptTemplates( [
				{
					col: 'prompt_type',
					op: 'eq',
					val: initialConf.initialPromptType,
				},
			] );

			if ( rsp.ok ) {
				const data = await rsp.json();
				if ( data && data.length > 0 ) {
					setInternalState( { ...internalState, templateName: data[ 0 ].template_name } );
					setAIGeneratorConfig( { ...useAIGenerator.getState().aiGeneratorConfig, promptTemplate: data[ 0 ].prompt_template } );
				}
			}
		};

		if ( initialConf.dataSource === 'SERP_CONTEXT' &&
			initialConf.keywordsList.length > 0 &&
			initialConf.keywordsList[ 0 ].q !== '' &&
			initialConf.serpUrlsList.length <= 0 ) {
			fetchTopUrls();
		}

		if ( initialConf.keywordsList.length > 0 && initialConf.keywordsList[ 0 ].q !== '' ) {
			fetchQueryCluster();
		}

		if ( initialConf.initialPromptType && initialConf.initialPromptType !== 'G' ) {
			getInitialPromptTemplate();
		}
	}, [] );

	useEffect( () => {
		setPromptVal( handleGeneratePrompt( aiGeneratorConfig, aiGeneratorConfig.promptTemplate ) );
	}, [ aiGeneratorConfig.keywordsList, aiGeneratorConfig.title, aiGeneratorConfig.promptTemplate ] );

	// handling keyword input, trying to get suggestions
	const handleChangeKeywordInput = ( val ) => {
		if ( val === '' ) {
			setAIGeneratorConfig( { ...aiGeneratorConfig, keywordsList: [] } );
			return;
		}

		if ( typingTimeout ) {
			clearTimeout( typingTimeout );
		}

		setTypingTimeout(
			setTimeout( async () => {
				const queryCluster = await getQueryCluster( val );
				setAIGeneratorConfig( { ...aiGeneratorConfig, keywordsList: [ { q: val, checked: true }, ...queryCluster ] } );
			}, 600 )
		);
	};

	// handling checking checkbox for keywords
	const handleKeywordsCheckboxCheck = ( checked, index ) => {
		const newList = aiGeneratorConfig.keywordsList.map( ( keyword, idx ) => {
			if ( idx === index ) {
				return { ...keyword, checked };
			}
			return keyword;
		} );
		setAIGeneratorConfig( { ...aiGeneratorConfig, keywordsList: newList } );
	};

	// handling serpUrlCheckboxCheck
	const handleSerpUrlCheckboxCheck = ( checked, index ) => {
		const newList = aiGeneratorConfig.serpUrlsList.map( ( url, idx ) => {
			if ( idx === index ) {
				return { ...url, checked };
			}
			return url;
		} );
		setAIGeneratorConfig( { ...aiGeneratorConfig, serpUrlsList: newList } );
	};

	// handling data source selection serp
	const handleDataSourceSelection = async ( val ) => {
		setAIGeneratorConfig( { ...aiGeneratorConfig, dataSource: val } );
		if ( val === 'SERP_CONTEXT' ) {
			const topUrls = await getTopUrls( aiGeneratorConfig );
			setAIGeneratorConfig( { ...useAIGenerator.getState().aiGeneratorConfig, serpUrlsList: topUrls } );
		}
	};

	// handling prompt template selection
	const handlePromptTemplateSelection = ( selectedTemplate ) => {
		if ( selectedTemplate ) {
			if ( selectedTemplate === 'Custom' ) {
				setInternalState( { ...internalState, templateName: 'Custom' } );
				return;
			}
			setAIGeneratorConfig( { ...aiGeneratorConfig, promptTemplate: allPromptTemplates[ selectedTemplate ].prompt_template } );
			setInternalState( { ...internalState, templateName: allPromptTemplates[ selectedTemplate ].template_name } );
		}
	};

	// handling save prompt template
	const handleSavePromptTemplate = async () => {
		if ( ! promptVal ) {
			return;
		}
		setInternalState( { ...internalState, addPromptTemplate: true } );
	};

	const handleGenerateContent = async () => {
		try {
			setInternalState( { ...internalState, isGenerating: true } );
			const processId = await generateContent( aiGeneratorConfig, promptVal );
			const pollForResult = setInterval( async () => {
				try {
					const resultResponse = await getAugmentProcessResult( processId );
					if ( resultResponse.ok ) {
						const generationRes = await resultResponse.json();
						if ( generationRes.status === 'SUCCESS' ) {
							clearInterval( pollForResult );
							onGenerateComplete( generationRes.response[ 0 ] );
							setInternalState( { ...internalState, isGenerating: false } );
						}
					} else {
						if ( resultResponse.status === 400 ) {
							const generationRes = await resultResponse.json();
							throw new Error( generationRes.message );
						}
						throw new Error( 'Failed to generate result. try again...' );
					}
				} catch ( error ) {
					clearInterval( pollForResult );
					setNotification( 1, { message: error.message, status: 'error' } );
					setInternalState( { ...internalState, isGenerating: false } );
				}
			}, 2000 );
		} catch ( e ) {
			setNotification( 1, { message: e.message, status: 'error' } );
			setInternalState( { ...internalState, isGenerating: false } );
		}
	};

	if ( ! promptTemplatesSuccess ) {
		return <Loader />;
	}

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
