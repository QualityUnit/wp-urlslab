import { useI18n } from '@wordpress/react-i18n';
import { memo, useState } from 'react';
import '../../assets/styles/components/_ContentGeneratorPanel.scss';
import { Editor, InputField, SingleSelectMenu, SuggestInputField } from '../../lib/tableImports';
import Loader from '../Loader';
import promptTemplates from '../../data/promptTemplates.json';
import TextAreaEditable from '../../elements/TextAreaEditable';
import EditableList from '../../elements/EditableList';
import { postFetch } from '../../api/fetching';
import Button from '../../elements/Button';
import Checkbox from '../../elements/Checkbox';

function ContentGeneratorPanel() {
	const { __ } = useI18n();
	const [ generationData, setGenerationData ] = useState( {} );
	const [ dataSource, setDataSource ] = useState( 'NO_CONTEXT' );
	const [ editorLoading, setEditorLoading ] = useState( true );
	const promptTemplateSelections = Object.entries( promptTemplates ).reduce( ( acc, [ key, value ] ) => {
		acc[ key ] = value.name;
		return acc;
	}, {} );
	const [ urlsList, setUrlsList ] = useState( [] );
	const [ keywordsList, setKeywordsList ] = useState( [] );
	const [ serpUrlList, setSerpUrlList ] = useState( [] );
	const [ domain, setDomain ] = useState( '' );
	const [ selectedPromptTemplate, setSelectedPromptTemplate ] = useState( '0' );
	const [ promptVal, setPromptVal ] = useState( '' );
	const [ isGenerating, setIsGenerating ] = useState( false );
	const [ generatedContent, setGeneratedContent ] = useState( '' );

	const contextTypes = {
		NO_CONTEXT: 'No Data Source',
		URL_CONTEXT: 'URL Data Source',
		DOMAIN_CONTEXT: 'Domain Data Source',
		SERP_CONTEXT: 'Google Search Source',
	};

	const contextTypesDescription = {
		NO_CONTEXT: __( 'If no data source is selected, the content will be generated solely based on the prompts you provide. No additional context or supplemental data will be implemented in the creation process.' ),
		URL_CONTEXT: __( 'When using a URL as the data Source, the generated content will be influenced by the information found in the chosen URL(s). This allows the text to be as relevant as possible to the content on your selected page(s).' ),
		DOMAIN_CONTEXT: __( 'Using a domain as the data source means the text will be based on data collected from pages across your entire domain. To use this feature, you\'ll need to add your domain to the domain section.' ),
		SERP_CONTEXT: __( 'Opting for a Google Search means that the content generated will focus on the Primary Keyword, similar keywords, and Search Engine Results Page (SERP) data. We collect information from top websites linked to your keyword to create original and relevant content.' ),
	};

	const contextTypePromptPlaceholder = {
		NO_CONTEXT: __( 'Your prompt to be used for generating text…' ),
		URL_CONTEXT: __( 'The prompt to be used for generating text from each url…' ),
		DOMAIN_CONTEXT: __( 'The prompt to be used to generate text from relevant content in your whole domain…' ),
		SERP_CONTEXT: __( 'The prompt to be used to generate text from top SERP Results targeting your keyword…' ),
	};

	// handling keyword input
	const [ typingTimeout, setTypingTimeout ] = useState( 0 );
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
					setKeywordsList( [ { q: val, checked: true }, ...queries ] );
				} else {
					setKeywordsList( [ { q: val, checked: true } ] );
				}
			}, 600 )
		);
	};

	const handleGenerateContent = async () => {
		setIsGenerating( true );

	}

	const handlePromptChange = ( value ) => {
		setPromptVal( value );
		setSelectedPromptTemplate( '0' );
	};

	const handlePromptTemplateChange = ( id ) => {
		setSelectedPromptTemplate( id );
		setPromptVal( promptTemplates[ id ].promptTemplate );
	};

	const handleCheckboxCheck = ( checked, index ) => {
		setKeywordsList( keywordsList.map( ( keyword, idx ) => {
			if ( idx === index ) {
				return { ...keyword, checked };
			}
			return keyword;
		} ) );
	};

	const handleSerpUrlCheckboxCheck = ( checked, index ) => {
		setSerpUrlList( serpUrlList.map( ( url, idx ) => {
			if ( idx === index ) {
				return { ...url, checked };
			}
			return url;
		} ) );
	};

	const handleSerpContextSelected = async ( val ) => {
		if ( val === 'SERP_CONTEXT' ) {
			const primaryKeyword = getSelectedKeywords()[ 0 ];
			const res = await postFetch( 'serp-queries/query/top-urls', { query: primaryKeyword } );
			if ( res.ok ) {
				const urls = await res.json();
				const d = urls.map( ( url ) => {
					return { ...url, checked: false };
				} );
				setSerpUrlList( d );
			}
		}
	};

	const getSelectedKeywords = () => {
		return keywordsList.filter( ( keyword ) => keyword.checked ).map( ( keyword ) => keyword.q );
	};

	return (
		<div className="urlslab-content-gen-panel">
			<div className="urlslab-content-gen-panel-control">
				<h2>Content Generator</h2>
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

				{
					keywordsList.length > 0 && <div className="urlslab-content-gen-panel-control-item-list">
						{ keywordsList.map( ( keyword, idx ) => {
							return (
								<div>
									<Checkbox
										defaultValue={ keyword.checked }
										onChange={ ( checked ) => handleCheckboxCheck( checked, idx ) }
									/> <span>{ keyword.q }</span>
								</div>
							);
						} )
						}
					</div>
				}

				<div className="urlslab-content-gen-panel-control-item">
					<div className="urlslab-content-gen-panel-control-item-desc">
						{ contextTypesDescription[ dataSource ] }
					</div>
					<div className="urlslab-content-gen-panel-control-item-selector">
						<SingleSelectMenu
							key={ dataSource }
							items={ contextTypes }
							name="context_menu"
							defaultAccept
							autoClose
							defaultValue={ dataSource }
							onChange={ ( val ) => {
								setDataSource( val );
								handleSerpContextSelected( val );
							} }
						/>
					</div>
				</div>

				{
					dataSource && dataSource === 'URL_CONTEXT' && (
						<div className="urlslab-content-gen-panel-control-item">
							<div className="urlslab-content-gen-panel-control-item-container">
								<EditableList
									placeholder="URLs to use..."
									itemList={ urlsList }
									addItemCallback={ ( item ) => setUrlsList( [ ...urlsList, item ] ) }
									removeItemCallback={ ( removingItem ) =>
										setUrlsList( urlsList.filter( ( item ) => item !== removingItem ) )
									}
								/>
							</div>
						</div>
					)
				}

				{
					dataSource && dataSource === 'DOMAIN_CONTEXT' && (
						<div className="urlslab-content-gen-panel-control-item">
							<div className="urlslab-content-gen-panel-control-item-container">
								<SuggestInputField
									suggestInput=""
									liveUpdate
									onChange={ ( val ) => setDomain( val ) }
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
					)
				}

				{
					dataSource && dataSource === 'SERP_CONTEXT' && (
						<div className="urlslab-content-gen-panel-control-item-list">
							{
								serpUrlList.map( ( url, idx ) => {
									return (
										<div>
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
						Prompt Template to choose
					</div>

					<div className="urlslab-content-gen-panel-control-item-selector">
						<SingleSelectMenu
							key={ selectedPromptTemplate }
							items={ promptTemplateSelections }
							name="context_menu"
							defaultAccept
							autoClose
							defaultValue={ selectedPromptTemplate }
							onChange={ handlePromptTemplateChange }
						/>
					</div>
				</div>

				<div className="urlslab-content-gen-panel-control-item">
					<TextAreaEditable
						liveUpdate
						val={ promptVal }
						defaultValue=""
						label={ __( 'Prompt' ) }
						rows={ 10 }
						allowResize
						onChange={ handlePromptChange }
						required
						placeholder={ contextTypePromptPlaceholder[ dataSource ] }
						description={ __( 'Prompt to be used while generating content' ) } />
				</div>

				<div className="urlslab-content-gen-panel-control-item">
					<Button active>
						{
							isGenerating ? ( <Loader /> ) : __( 'Generate Text' )
						}
					</Button>
				</div>

			</div>
			<div className="urlslab-content-gen-panel-editor">
				{
					editorLoading && <Loader />
				}
				<Editor onChange={ ( val ) => console.log( val ) }
					initCallback={ () => setEditorLoading( false ) } />
			</div>
		</div>
	);
}

export default memo( ContentGeneratorPanel );
