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
import promptTemplates from '../../data/promptTemplates.json';
import '../../assets/styles/components/_ContentGeneratorPanel.scss';
import {
	generateContent,
	getQueryCluster,
	getTopUrls,
	handleGeneratePrompt,
} from '../../lib/aiGeneratorPanel';
import { getAugmentProcessResult } from '../../api/generatorApi';
import useAIModelsQuery from '../../queries/useAIModelsQuery';

function ContentGeneratorConfigPanel( { initialData = {}, onGenerateComplete } ) {
	const { __ } = useI18n();
	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const [ typingTimeout, setTypingTimeout ] = useState( 0 );
	const [ isGenerating, setIsGenerating ] = useState( false );
	const [ errorGeneration, setErrorGeneration ] = useState( '' );
	const promptTemplateSelections = Object.entries( promptTemplates ).reduce( ( acc, [ key, value ] ) => {
		acc[ key ] = value.name;
		return acc;
	}, {} );

	//handling the initial loading with preloaded data
	useEffect( () => {
		// setting initial state
		setAIGeneratorConfig( { ...aiGeneratorConfig, ...initialData } );

		const fetchTopUrls = async () => {
			const topUrls = await getTopUrls( aiGeneratorConfig );
			setAIGeneratorConfig( { ...aiGeneratorConfig, serpUrlsList: topUrls } );
		};

		if ( aiGeneratorConfig.dataSource === 'SERP_CONTEXT' &&
			aiGeneratorConfig.keywordsList.length > 0 &&
			aiGeneratorConfig.keywordsList[ 0 ].q !== '' &&
			aiGeneratorConfig.serpUrlsList.length <= 0 ) {
			fetchTopUrls();
		}

		if ( aiGeneratorConfig.selectedPromptTemplate !== '0' ) {
			setAIGeneratorConfig( { ...aiGeneratorConfig, promptTemplate: promptTemplates[ aiGeneratorConfig.selectedPromptTemplate ].promptTemplate } );
		}

		const promptVal = handleGeneratePrompt( aiGeneratorConfig, promptTemplates[ aiGeneratorConfig.selectedPromptTemplate ].promptTemplate );
		setAIGeneratorConfig( { ...aiGeneratorConfig, promptVal } );
	}, [] );

	// handling keyword input, trying to get suggestions
	const handleChangeKeywordInput = ( val ) => {
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
	const handlePromptTemplateSelection = ( id ) => {
		setAIGeneratorConfig( { ...aiGeneratorConfig, selectedPromptTemplate: id } );
		const prompt = handleGeneratePrompt( aiGeneratorConfig, promptTemplates[ id ].promptTemplate );
		setAIGeneratorConfig( { ...aiGeneratorConfig, promptVal: prompt } );
	};

	const handleGenerateContent = async () => {
		try {
			setIsGenerating( true );
			const processId = await generateContent( aiGeneratorConfig );
			const pollForResult = setInterval( async () => {
				try {
					const resultResponse = await getAugmentProcessResult( processId );
					if ( resultResponse.ok ) {
						const generationRes = await resultResponse.json();
						if ( generationRes.status === 'SUCCESS' ) {
							clearInterval( pollForResult );
							onGenerateComplete( generationRes.response[ 0 ] );
							setIsGenerating( false );
						}
					} else {
						throw new Error( 'Failed to generate result. try again...' );
					}
				} catch ( error ) {
					clearInterval( pollForResult );
					throw error;
				}
			}, 2000 );
		} catch ( e ) {
			setErrorGeneration( e.message );
			setIsGenerating( false );
		}
	};

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
					/>
				</div>
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				<div className="urlslab-content-gen-panel-control-item-selector">
					<SingleSelectMenu
						key={ aiGeneratorConfig.selectedPromptTemplate }
						items={ promptTemplateSelections }
						name="context_menu"
						defaultAccept
						autoClose
						defaultValue={ aiGeneratorConfig.selectedPromptTemplate }
						onChange={ handlePromptTemplateSelection }
					>{ __( 'Prompt Template' ) }</SingleSelectMenu>
				</div>
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				<TextAreaEditable
					liveUpdate
					val={ aiGeneratorConfig.promptVal }
					defaultValue=""
					label={ __( 'Prompt' ) }
					rows={ 10 }
					allowResize
					onChange={ ( value ) => {
						setAIGeneratorConfig( { ...aiGeneratorConfig, promptVal: value, selectedPromptTemplate: '0' } );
					} }
					required
					placeholder={ contextTypePromptPlaceholder[ aiGeneratorConfig.dataSource ] }
					description={ __( 'Prompt to be used while generating content' ) } />
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
				/>
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				<Button active onClick={ handleGenerateContent }>
					{
						isGenerating ? ( <Loader /> ) : __( 'Generate Text' )
					}
				</Button>
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				{ errorGeneration && <div>{ errorGeneration }</div> }
			</div>

		</div>
	);
}

export default memo( ContentGeneratorConfigPanel );
