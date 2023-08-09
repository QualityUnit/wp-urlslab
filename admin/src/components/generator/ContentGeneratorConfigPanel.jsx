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
	augmentWithDomainContext,
	augmentWithoutContext,
	augmentWithURLContext,
	getAugmentProcessResult,
} from '../../api/generatorApi';

function ContentGeneratorConfigPanel( { initialData = {}, onGenerateComplete } ) {
	const { __ } = useI18n();
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
		setAIGeneratorConfig( { ...aiGeneratorConfig, ...initialData } );

		if ( aiGeneratorConfig.dataSource === 'SERP_CONTEXT' &&
			aiGeneratorConfig.keywordsList.length > 0 &&
			aiGeneratorConfig.keywordsList[ 0 ].q !== '' &&
			aiGeneratorConfig.serpUrlsList.length <= 0 ) {
			handleSerpContextSelected( 'SERP_CONTEXT' );
		}

		if ( aiGeneratorConfig.selectedPromptTemplate !== '0' ) {
			setAIGeneratorConfig( { ...aiGeneratorConfig, promptTemplate: promptTemplates[ aiGeneratorConfig.selectedPromptTemplate ].promptTemplate } );
		}

		handleGeneratePrompt( promptTemplates[ aiGeneratorConfig.selectedPromptTemplate ].promptTemplate );
	}, [] );

	// handling generating final prompt based on prompt template variables
	const handleGeneratePrompt = ( val ) => {
		let finalPrompt = val;
		const selectedKeywords = getSelectedKeywords();
		if ( val.includes( '{keyword}' ) && selectedKeywords.length > 0 ) {
			finalPrompt = val.replace( '{keyword}', getSelectedKeywords().join( ', ' ) );
		}

		if ( val.includes( '{primary_keyword}' ) && selectedKeywords.length > 0 ) {
			finalPrompt = val.replace( '{primary_keyword}', getSelectedKeywords()[ 0 ] );
		}

		if ( val.includes( '{language}' ) && aiGeneratorConfig.language ) {
			finalPrompt = val.replace( '{language}', aiGeneratorConfig.language );
		}

		setAIGeneratorConfig( { ...aiGeneratorConfig, promptVal: finalPrompt } );
	};

	// handling keyword input, trying to get suggestions
	const handleChangeKeywordInput = ( val ) => {
		if ( typingTimeout ) {
			clearTimeout( typingTimeout );
		}

		setTypingTimeout(
			setTimeout( async () => {
				if ( val === '' ) {
					return [];
				}
				const res = await postFetch( 'serp-queries/query-cluster', { query: val } );
				if ( res.ok ) {
					const keywords = await res.json();
					const queries = keywords.filter( ( keyword ) => keyword.query !== val )
						.map( ( keyword ) => {
							return { q: keyword.query, checked: false };
						} );
					setAIGeneratorConfig( { ...aiGeneratorConfig, keywordsList: [ { q: val, checked: true }, ...queries ] } );
				} else {
					setAIGeneratorConfig( { ...aiGeneratorConfig, keywordsList: [ { q: val, checked: true } ] } );
				}
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

	// handling serp context selection - fetching top serp results
	const handleSerpContextSelected = async ( val ) => {
		if ( val === 'SERP_CONTEXT' ) {
			const primaryKeyword = getSelectedKeywords()[ 0 ];
			const res = await postFetch( 'serp-queries/query/top-urls', { query: primaryKeyword } );
			if ( res.ok ) {
				const urls = await res.json();
				const urlsWithCheck = urls.map( ( url ) => {
					return { ...url, checked: false };
				} );
				setAIGeneratorConfig( { ...useAIGenerator.getState().aiGeneratorConfig, serpUrlsList: urlsWithCheck } );
			}
		}
	};

	// selected keywords
	const getSelectedKeywords = () => {
		return aiGeneratorConfig.keywordsList.filter( ( keyword ) => keyword.checked ).map( ( keyword ) => keyword.q );
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

	// handling generate content
	const handleGenerateContent = async () => {
		setIsGenerating( true );
		try {
			/// getting he Process ID for Generation
			let processIdResponse;

			if ( aiGeneratorConfig.dataSource === 'NO_CONTEXT' ) {
				processIdResponse = await augmentWithoutContext( aiGeneratorConfig.promptVal, aiGeneratorConfig.modelName );
			}

			if ( aiGeneratorConfig.dataSource === 'DOMAIN_CONTEXT' ) {
				processIdResponse = await augmentWithDomainContext( aiGeneratorConfig.domain, aiGeneratorConfig.promptVal, aiGeneratorConfig.modelName, aiGeneratorConfig.semanticContext );
			}

			if ( aiGeneratorConfig.dataSource === 'SERP_CONTEXT' ) {
				processIdResponse = await augmentWithURLContext(
					[ ...aiGeneratorConfig.serpUrlsList.filter( ( url ) => url.checked ).map( ( url ) => url.url_name ) ],
					aiGeneratorConfig.promptVal,
					aiGeneratorConfig.modelName
				);
			}

			if ( aiGeneratorConfig.dataSource === 'URL_CONTEXT' ) {
				processIdResponse = await augmentWithURLContext( [ ...aiGeneratorConfig.urlsList ], aiGeneratorConfig.promptVal, aiGeneratorConfig.modelName );
			}

			if ( processIdResponse.ok ) {
				const rsp = await processIdResponse.json();
				const processId = rsp.processId;
				// begin pinging (polling) for results
				const pollForResult = setInterval( async () => {
					try {
						const resultResponse = await getAugmentProcessResult( processId );
						if ( processIdResponse.ok ) {
							const generationRes = await resultResponse.json();
							if ( generationRes.status === 'SUCCESS' ) {
								clearInterval( pollForResult );
								onGenerateComplete( generationRes.response[ 0 ] );
								setIsGenerating( false );
							}
						} else {
							clearInterval( pollForResult );
							setIsGenerating( false );
							setErrorGeneration( 'Failed to generate result. try again...' );
						}
					} catch ( error ) {
						clearInterval( pollForResult );
						setIsGenerating( false );
						setErrorGeneration( error.message );
					}
				}, 2000 );
			} else {
				setIsGenerating( false );
				const rsp = await processIdResponse.json();
				setErrorGeneration( rsp.message );
			}
		} catch ( error ) {
			setIsGenerating( false );
			setErrorGeneration( error.message );
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
						onChange={ async ( val ) => {
							setAIGeneratorConfig( { ...aiGeneratorConfig, dataSource: val } );
							await handleSerpContextSelected( val );
						} }
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
				<div className="urlslab-content-gen-panel-control-item-desc">
					Language
				</div>

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
				<div className="urlslab-content-gen-panel-control-item-desc">
					Prompt Template to choose
				</div>

				<div className="urlslab-content-gen-panel-control-item-selector">
					<SingleSelectMenu
						key={ aiGeneratorConfig.selectedPromptTemplate }
						items={ promptTemplateSelections }
						name="context_menu"
						defaultAccept
						autoClose
						defaultValue={ aiGeneratorConfig.selectedPromptTemplate }
						onChange={ ( id ) => {
							setAIGeneratorConfig( { ...aiGeneratorConfig, selectedPromptTemplate: id } );
							handleGeneratePrompt( promptTemplates[ id ].promptTemplate );
						} }
					/>
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
						setAIGeneratorConfig( { ...aiGeneratorConfig, promptVal: value } );
						setAIGeneratorConfig( { ...aiGeneratorConfig, selectedPromptTemplate: '0' } );
					} }
					required
					placeholder={ contextTypePromptPlaceholder[ aiGeneratorConfig.dataSource ] }
					description={ __( 'Prompt to be used while generating content' ) } />
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				<SingleSelectMenu
					key={ aiGeneratorConfig.modelName }
					items={ {
						'gpt-3.5-turbo': 'OpenAI GPT 3.5 Turbo',
						'gpt-4': 'OpenAI GPT 4',
						'text-davinci-003': 'OpenAI GPT Davinci 003',
					} }
					name="mode_name_menu"
					defaultAccept
					autoClose
					defaultValue={ aiGeneratorConfig.modelName }
					onChange={ ( val ) => setAIGeneratorConfig( { type: 'setModelName', key: val } ) }
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
