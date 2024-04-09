import { __ } from '@wordpress/i18n';
import { setNotification } from '../../hooks/useNotifications';
import { createPromptTemplate } from '../../api/generatorApi';
import importCsv from '../../api/importCsv';
import { handleApiError } from '../../api/fetching';

export const newPromptDefaults = {
	promptType: 'B',
	templateName: '',
	saving: false,
	showSaveForm: false,
};

export const savePromptTemplate = async ( templateData, actions, queryClient ) => {
	actions.newPromptDataCallback( ( state ) => ( { ...state, saving: true } ) );
	setNotification( 'new-prompt-template', { message: __( 'Saving template…', 'urlslab' ), status: 'info' } );

	const response = await createPromptTemplate( templateData );

	if ( response.ok ) {
		setNotification( 'new-prompt-template', { message: __( 'Template saved successfully.', 'urlslab' ), status: 'success' } );
		queryClient.invalidateQueries( [ 'prompt-template' ] );
		actions.aiGeneratorHelpersCallback( { templateName: templateData.template_name } );
		actions.newPromptDataCallback( newPromptDefaults );
		return;
	}
	actions.newPromptDataCallback( ( state ) => ( { ...state, saving: false } ) );
	handleApiError( 'new-prompt-template', response, { title: __( 'Template saving failed', 'urlslab' ) } );
};

export const scalableGeneratorImportKeywords = async ( {
	aiGeneratorScalableHelpers,
	setAIGeneratorScalableHelpers,
	aiGeneratorConfig,
	stopImport,
	queryClient,
	finishCallback,
} ) => {
	setAIGeneratorScalableHelpers( { importStatus: 1 } );
	const slug = 'process/generator-task';
	let importCounter = 0;

	const handleImportStatus = ( val ) => {
		if ( ! Number.isInteger( val ) ) {
			setAIGeneratorScalableHelpers( { importStatus: 0 } );
			setNotification( 1, { message: val, status: 'error' } );
			return;
		}

		setAIGeneratorScalableHelpers( { importStatus: val } );

		if ( importCounter === 0 ) {
			queryClient.invalidateQueries( [ slug ] );
		}

		if ( val === 100 ) {
			importCounter = 0;
			queryClient.invalidateQueries( [ slug ] );
			setTimeout( () => {
				finishCallback();
			}, 1000 );
		}
		importCounter += 1;
	};

	await importCsv( {
		slug: `${ slug }/import`,
		dataArray: aiGeneratorScalableHelpers.keywords[ aiGeneratorScalableHelpers.keywordsInputType ],
		globalImportData: {
			post_type: aiGeneratorScalableHelpers.postType,
			prompt_template: aiGeneratorConfig.promptTemplate,
			model_name: aiGeneratorConfig.modelName,
			with_serp_url_context: aiGeneratorScalableHelpers.dataSource === 'SERP_CONTEXT',
		},
		result: handleImportStatus,
		stopImport,
	} );
};

