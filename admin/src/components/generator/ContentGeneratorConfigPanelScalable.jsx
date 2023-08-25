import { memo, useRef, useState } from 'react';
import Button from '../../elements/Button';
import useAIModelsQuery from '../../queries/useAIModelsQuery';
import usePromptTemplateQuery from '../../queries/usePromptTemplateQuery';
import { useI18n } from '@wordpress/react-i18n';
import { jsonToCSV, useCSVReader } from 'react-papaparse';
import useAIGenerator, {
	contextTypePromptPlaceholder,
	contextTypes,
	contextTypesDescription,
} from '../../hooks/useAIGenerator';
import { SingleSelectMenu } from '../../lib/tableImports';
import TextAreaEditable from '../../elements/TextAreaEditable';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPostTypes } from '../../api/generatorApi';
import ProgressBar from '../../elements/ProgressBar';
import { ReactComponent as ImportIcon } from '../../assets/images/icons/icon-import.svg';
import { ReactComponent as CloseIcon } from '../../assets/images/icons/icon-close.svg';
import importCsv from '../../api/importCsv';
import { sampleKeywordData } from '../../data/sample-keywords-data.json';
import fileDownload from 'js-file-download';
import { setNotification } from '../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import EditRowPanel from '../EditRowPanel';
import usePromptTemplateEditorRow from './usePromptTemplateEditorRow';

function ContentGeneratorConfigPanelScalable() {
	const { __ } = useI18n();
	const slug = 'process/generator-task';
	const { CSVReader } = useCSVReader();
	const queryClient = useQueryClient();
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
		keywords: [],
		importStatus: 0,
		activeGeneratePostPanel: 'ImportPanel', // ImportPanel or ManualPanel
		dataSource: 'NO_CONTEXT', // NO_CONTEXT, SERP_CONTEXT
	} );
	const stopImport = useRef( false );
	let importCounter = 0;
	const navigate = useNavigate();

	const { rowEditorCells, rowToEdit } = usePromptTemplateEditorRow();

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

	const handleDownloadSampleData = () => {
		const csv = jsonToCSV( sampleKeywordData, {
			delimiter: ',',
			header: true }
		);

		fileDownload( csv, 'sample-keyword.csv' );
	};

	const isGenerateDisabled = () => {
		return internalState.importStatus !== 0 ||
			( ( internalState.activeGeneratePostPanel === 'ImportPanel' && internalState.keywords.length === 0 ) ||
				( internalState.activeGeneratePostPanel === 'ManualPanel' && internalState.manualKeywords.length === 0 ) );
	};

	const handleImportStatus = ( val ) => {
		if ( ! Number.isInteger( val ) ) {
			setInternalState( { ...internalState, importStatus: 0 } );
			setNotification( 1, { message: val, status: 'error' } );
			return;
		}

		setInternalState( { ...internalState, importStatus: val } );

		if ( importCounter === 0 ) {
			queryClient.invalidateQueries( [ slug ] );
		}

		if ( val === 100 ) {
			importCounter = 0;
			queryClient.invalidateQueries( [ slug ] );
			setTimeout( () => {
				setInternalState( { ...internalState, importStatus: 0 } );
				navigate( '/Generator' );
			}, 1000 );
		}
		importCounter += 1;
	};

	const importData = useMutation( {
		mutationFn: async ( keywords ) => {
			await importCsv( {
				slug: `${ slug }/import`,
				dataArray: keywords,
				globalImportData: {
					post_type: internalState.postType,
					prompt_template: aiGeneratorConfig.promptTemplate,
					model_name: aiGeneratorConfig.modelName,
					with_serp_url_context: internalState.dataSource === 'SERP_CONTEXT',
				},
				result: handleImportStatus,
				stopImport,
			} );
		},
	} );

	const handleImportKeywords = async () => {
		if ( internalState.activeGeneratePostPanel === 'ImportPanel' ) {
			setInternalState( { ...internalState, importStatus: 1 } );
			importData.mutate( internalState.keywords );
		}

		if ( internalState.activeGeneratePostPanel === 'ManualPanel' ) {
			setInternalState( { ...internalState, importStatus: 1 } );
			importData.mutate( internalState.manualKeywords );
		}
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
					<SingleSelectMenu
						key={ internalState.dataSource }
						items={ Object.keys( contextTypes ).reduce( ( obj, key ) => {
							if ( key === 'NO_CONTEXT' || key === 'SERP_CONTEXT' ) {
								obj[ key ] = contextTypes[ key ];
							}
							return obj;
						}, {} ) }
						name="context_menu"
						defaultAccept
						autoClose
						defaultValue={ internalState.dataSource }
						onChange={ ( dataSource ) => setInternalState( { ...internalState, dataSource } ) }
					/>
				</div>
				<div className="urlslab-content-gen-panel-control-item-desc">
					{ contextTypesDescription[ internalState.dataSource ] }
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

			<div className="urlslab-content-gen-panel-control-item">
				<h3>Import CSV</h3>
				<p>You can import a CSV of the keywords you want to create post from. the csv should hava a header named keyword.</p>
				<CSVReader
					onUploadAccepted={ ( results ) => {
						setInternalState( { ...internalState, keywords: results.data.map( ( k ) => k.keyword ).filter( ( k ) => k !== '' ) } );
					} }
					config={ {
						header: true,
					} }
				>
					{ ( {
						getRootProps,
						acceptedFile,
						getRemoveFileProps,
					} ) => (
						<div className="flex">
							<div className="ma-left flex flex-align-center flex-justify-center w-100">
								{ acceptedFile &&
									<button onClick={ ( e ) => {
										setInternalState( { ...internalState, keywords: [] } );
										getRemoveFileProps().onClick( e );
									} } className="removeFile flex flex-align-center">{ acceptedFile.name } <CloseIcon /></button>
								}
								<Button className="mr-s" onClick={ handleDownloadSampleData }>
									{ __( 'Download Sample Data' ) }
								</Button>
								<Button { ...getRootProps() } active>
									<ImportIcon />
									{ __( 'Import CSV' ) }
								</Button>
							</div>
						</div>

					) }
				</CSVReader>
			</div>

			{ /*<div>*/ }
			{ /*	<h3>Write the Keywords to create post from</h3>*/ }
			{ /*	<TextArea*/ }
			{ /*		key={ internalState.manualKeywords } // hotfix to rerender component after next generating :/*/ }
			{ /*		label={ __( 'Generated text' ) }*/ }
			{ /*		rows={ 11 }*/ }
			{ /*		defaultValue={ internalState.manualKeywords.join( '\n' ) }*/ }
			{ /*		onChange={ ( value ) => setInternalState( { ...internalState, manualKeywords: value.split( '\n' ) } ) }*/ }
			{ /*		liveUpdate*/ }
			{ /*	/>*/ }
			{ /*</div>*/ }

			<div className="urlslab-content-gen-panel-control-item">
				<Button active disabled={ isGenerateDisabled() } onClick={ handleImportKeywords }>
					{ internalState.activeGeneratePostPanel === 'ImportPanel' && ( internalState.keywords.length === 0 ? __( 'Generate Posts' ) : `Generate ${ internalState.keywords.length } Posts` ) }
					{ internalState.activeGeneratePostPanel === 'ManualPanel' && ( internalState.manualKeywords.length === 0 ? __( 'Generate Posts' ) : `Generate ${ internalState.keywords.length } Posts` ) }
				</Button>
				{ internalState.importStatus
					? <ProgressBar className="mb-m" notification="Importing…" value={ internalState.importStatus } />
					: null
				}
			</div>

			{
				internalState.addPromptTemplate && (
					<EditRowPanel slug="prompt-template" rowEditorCells={ rowEditorCells } rowToEdit={ rowToEdit }
						title="Add Prompt Template"
						handlePanel={ () => setInternalState( { ...internalState, addPromptTemplate: false } ) }
					/>
				)
			}
		</div>
	);
}

export default memo( ContentGeneratorConfigPanelScalable );
