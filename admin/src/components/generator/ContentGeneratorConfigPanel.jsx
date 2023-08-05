import { InputField, SingleSelectMenu, SuggestInputField } from '../../lib/tableImports';
import Checkbox from '../../elements/Checkbox';
import EditableList from '../../elements/EditableList';
import { postFetch } from '../../api/fetching';
import { fetchLangs } from '../../api/fetchLangs';
import TextAreaEditable from '../../elements/TextAreaEditable';
import Button from '../../elements/Button';
import Loader from '../Loader';
import { memo, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useAIGenerator, {
	contextTypePromptPlaceholder,
	contextTypes,
	contextTypesDescription,
} from '../../hooks/useAIGenerator';
import promptTemplates from '../../data/promptTemplates.json';
import {
	augmentWithDomainContext,
	augmentWithoutContext,
	augmentWithURLContext,
	getAugmentProcessResult,
} from '../../api/generatorApi';

function ContentGeneratorConfigPanel( { initialData = {}, onGenerateComplete } ) {
	const { __ } = useI18n();
	const { state, dispatch } = useAIGenerator( initialData );
	const [ typingTimeout, setTypingTimeout ] = useState( 0 );
	const [ isGenerating, setIsGenerating ] = useState( false );
	const [ errorGeneration, setErrorGeneration ] = useState( '' );
	const promptTemplateSelections = Object.entries( promptTemplates ).reduce( ( acc, [ key, value ] ) => {
		acc[ key ] = value.name;
		return acc;
	}, {} );

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
					dispatch( { type: 'setKeywordsList', key: [ { q: val, checked: true }, ...queries ] } );
				} else {
					dispatch( { type: 'setKeywordsList', key: [ { q: val, checked: true } ] } );
				}
			}, 600 )
		);
	};

	// handling checking checkbox for keywords
	const handleKeywordsCheckboxCheck = ( checked, index ) => {
		const newList = state.keywordsList.map( ( keyword, idx ) => {
			if ( idx === index ) {
				return { ...keyword, checked };
			}
			return keyword;
		} );
		dispatch( { type: 'setKeywordsList', key: newList } );
	};

	// handling serp context selection - fetching top serp results
	const handleSerpContextSelected = async ( val ) => {
		if ( val === 'SERP_CONTEXT' ) {
			const primaryKeyword = getSelectedKeywords()[ 0 ];
			const res = await postFetch( 'serp-queries/query/top-urls', { query: primaryKeyword } );
			if ( res.ok ) {
				const urls = await res.json();
				const d = urls.map( ( url ) => {
					return { ...url, checked: false };
				} );
				dispatch( { type: 'setSerpUrlsList', key: d } );
			}
		}
	};

	// selected keywords
	const getSelectedKeywords = () => {
		return state.keywordsList.filter( ( keyword ) => keyword.checked ).map( ( keyword ) => keyword.q );
	};

	// handling serpUrlCheckboxCheck
	const handleSerpUrlCheckboxCheck = ( checked, index ) => {
		const newList = state.serpUrlsList.map( ( url, idx ) => {
			if ( idx === index ) {
				return { ...url, checked };
			}
			return url;
		} );
		dispatch( { type: 'setSerpUrlsList', key: newList } );
	};

	// handling generate content
	const handleGenerateContent = async () => {
		setIsGenerating( true );
		try {
			/// getting he Process ID for Generation
			let processIdResponse;

			if ( state.dataSource === 'NO_CONTEXT' ) {
				processIdResponse = await augmentWithoutContext( state.promptVal, state.modelName );
			}

			if ( state.dataSource === 'DOMAIN_CONTEXT' ) {
				processIdResponse = await augmentWithDomainContext( state.domain, state.promptVal, state.modelName, state.semanticContext );
			}

			if ( state.dataSource === 'SERP_CONTEXT' ) {
				processIdResponse = await augmentWithURLContext(
					[ ...state.serpUrlsList.filter( ( url ) => url.checked ).map( ( url ) => url.url_name ) ],
					state.promptVal,
					state.modelName
				);
			}

			if ( state.dataSource === 'URL_CONTEXT' ) {
				processIdResponse = await augmentWithURLContext( [ ...state.urlsList ], state.promptVal, state.modelName );
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
				state.mode === 'WITH_INPUT_VAL' && (
					<div className="urlslab-content-gen-panel-control-item">
						<InputField
							liveUpdate
							defaultValue=""
							description={ __( 'Input Value' ) }
							label={ __( 'Input Value to use in prompt' ) }
							onChange={ ( val ) => dispatch( { type: 'setInputValue', key: val } ) }
							required
						/>
					</div>
				)
			}

			{
				state.mode === 'CREATE_POST' && (
					<div className="urlslab-content-gen-panel-control-item">
						<InputField
							liveUpdate
							defaultValue=""
							description={ __( 'Keyword to Pick' ) }
							label={ __( 'Keyword' ) }
							onChange={ ( val ) => handleChangeKeywordInput( val ) }
							required
						/>
					</div>
				)
			}

			{
				state.keywordsList.length > 0 && <div className="urlslab-content-gen-panel-control-item-list">
					{ state.keywordsList.map( ( keyword, idx ) => {
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
					{ contextTypesDescription[ state.dataSource ] }
				</div>
				<div className="urlslab-content-gen-panel-control-item-selector">
					<SingleSelectMenu
						key={ state.dataSource }
						items={ contextTypes }
						name="context_menu"
						defaultAccept
						autoClose
						defaultValue={ state.dataSource }
						onChange={ ( val ) => {
							dispatch( { type: 'setDataSource', key: val } );
							handleSerpContextSelected( val );
						} }
					/>
				</div>
			</div>

			{
				state.dataSource && state.dataSource === 'URL_CONTEXT' && (
					<div className="urlslab-content-gen-panel-control-item">
						<div className="urlslab-content-gen-panel-control-item-container">
							<EditableList
								placeholder="URLs to use..."
								itemList={ state.urlsList }
								addItemCallback={ ( item ) => dispatch( {
									type: 'setUrlsList',
									key: [ ...state.urlsList, item ],
								} ) }
								removeItemCallback={ ( removingItem ) =>
									dispatch( {
										type: 'setUrlsList',
										key: state.urlsList.filter( ( item ) => item !== removingItem ),
									} )
								}
							/>
						</div>
					</div>
				)
			}

			{
				state.dataSource && state.dataSource === 'DOMAIN_CONTEXT' && (
					<div>
						<div className="urlslab-content-gen-panel-control-item">
							<div className="urlslab-content-gen-panel-control-item-container">
								<SuggestInputField
									suggestInput=""
									liveUpdate
									onChange={ ( val ) => dispatch( { type: 'setDomain', key: val } ) }
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
									onChange={ ( val ) => dispatch( { type: 'setSemanticContext', key: val } ) }
									required
								/>
							</div>
						</div>
					</div>
				)
			}

			{
				state.dataSource && state.dataSource === 'SERP_CONTEXT' && (
					<div className="urlslab-content-gen-panel-control-item-list">
						{
							state.serpUrlsList.map( ( url, idx ) => {
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
						key={ state.lang }
						items={ fetchLangs() }
						name="lang_menu"
						defaultAccept
						autoClose
						defaultValue={ state.lang }
						onChange={ ( val ) => dispatch( { type: 'setLang', key: val } ) }
					/>
				</div>
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				<div className="urlslab-content-gen-panel-control-item-desc">
					Prompt Template to choose
				</div>

				<div className="urlslab-content-gen-panel-control-item-selector">
					<SingleSelectMenu
						key={ state.selectedPromptTemplate }
						items={ promptTemplateSelections }
						name="context_menu"
						defaultAccept
						autoClose
						defaultValue={ state.selectedPromptTemplate }
						onChange={ ( id ) => {
							dispatch( { type: 'setSelectedPromptTemplate', key: id } );
							dispatch( { type: 'setPromptVal', key: promptTemplates[ id ].promptTemplate } );
						} }
					/>
				</div>
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				<TextAreaEditable
					liveUpdate
					val={ state.promptVal }
					defaultValue=""
					label={ __( 'Prompt' ) }
					rows={ 10 }
					allowResize
					onChange={ ( value ) => {
						dispatch( { type: 'setPromptVal', key: value } );
						dispatch( { type: 'setSelectedPromptTemplate', key: '0' } );
					} }
					required
					placeholder={ contextTypePromptPlaceholder[ state.dataSource ] }
					description={ __( 'Prompt to be used while generating content' ) } />
			</div>

			<div className="urlslab-content-gen-panel-control-item">
				<SingleSelectMenu
					key={ state.modelName }
					items={ {
						'gpt-3.5-turbo': 'OpenAI GPT 3.5 Turbo',
						'gpt-4': 'OpenAI GPT 4',
						'text-davinci-003': 'OpenAI GPT Davinci 003',
					} }
					name="mode_name_menu"
					defaultAccept
					autoClose
					defaultValue={ state.modelName }
					onChange={ ( val ) => dispatch( { type: 'setModelName', key: val } ) }
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
