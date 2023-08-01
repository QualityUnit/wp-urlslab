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
	const [ domain, setDomain ] = useState( '' );
	const [ selectedPromptTemplate, setSelectedPromptTemplate ] = useState( '0' );
	const [ promptVal, setPromptVal ] = useState( '' );

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

	const handlePromptChange = ( value ) => {
		setPromptVal( value );
		setSelectedPromptTemplate( '0' );
	};

	const handlePromptTemplateChange = ( id ) => {
		setSelectedPromptTemplate( id );
		setPromptVal( promptTemplates[ id ].promptTemplate );
	};

	const handleFetchRelatedKeywords = async ( query ) => {
		const { data } = await postFetch( 'serp-queries/query/related-queries', { query } );
		setKeywordsList( [ ...keywordsList, ...data ] );
	};

	return (
		<div className="urlslab-content-gen-panel">
			<div className="urlslab-content-gen-panel-control">
				<h2>Content Generator</h2>
				<div className="urlslab-content-gen-panel-control-item">
					<InputField
						liveUpdate
						defaultValue=""
						description={ __( 'The Topic you want to generate content about' ) }
						label={ __( 'Topic' ) }
						onChange={ ( val ) => setGenerationData( { ...generationData, topic: val } ) }
						required
					/>
				</div>

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
							onChange={ ( val ) => setDataSource( val ) }
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
						<div className="urlslab-content-gen-panel-control-item">
							<div className="urlslab-content-gen-panel-control-item-container">
								<EditableList
									placeholder="Keyword to use..."
									extraButtonText={ __( 'more Keywords' ) }
									extraButtonCallback={ handleFetchRelatedKeywords }
									itemList={ keywordsList }
									addItemCallback={ ( item ) => setKeywordsList( [ ...keywordsList, item ] ) }
									removeItemCallback={ ( removingItem ) =>
										setKeywordsList( keywordsList.filter( ( item ) => item !== removingItem ) )
									}
								/>
							</div>
						</div>
					)
				}

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
