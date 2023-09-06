import { __ } from '@wordpress/i18n';
import { create } from 'zustand';

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

const fallbackData = {
	inputValue: '', // input value for the generator
	dataSource: 'NO_CONTEXT', // no datasource context selected by default
	lang: 'en', // en lang by default
	initialPromptType: 'G', // Initial Prompt Type selected
	title: '', // title of the created content - only applies in creating new post
	postType: '', // post type of the created content - only applies in creating new post
	urlsList: [], // list of urls to generate content from - only applies in URL_CONTEXT dataStore
	keywordsList: [], // list of keywords to generate content from
	serpUrlsList: [], // list of urls to generate content from - only applies in SERP_CONTEXT dataStore
	domain: '', // domain to generate content from - only applies in DOMAIN_CONTEXT dataStore
	promptTemplate: '', // prompt template to generate content from
	semanticContext: '', // semantic context to for fetching relevant data - only applies in DOMAIN_CONTEXT dataStore
	modelName: 'gpt-3.5-turbo', // model name to use for generation
	mode: 'CREATE_POST_WITH_SCALABLE_OPTION', // mode of the generator - CREATE_POST or WITH_INPUT_VAL or CREATE_POST_WITH_SCALABLE_OPTION
};

const helpersData = {
	editorVal: '',
	editorLoading: true,
	templateName: __( 'Custom' ),
};
const useAIGenerator = create( ( set ) => ( {
	aiGeneratorConfig: fallbackData,
	aiGeneratorHelpers: helpersData,
	setAIGeneratorConfig: ( values ) => set( ( state ) => ( { ...state, aiGeneratorConfig: { ... state.aiGeneratorConfig, ...values } } ) ),
	setAIGeneratorHelpers: ( values ) => set( ( state ) => ( { ...state, aiGeneratorHelpers: { ... state.aiGeneratorHelpers, ...values } } ) ),

} ) );

export default useAIGenerator;
export { contextTypes, contextTypesDescription, contextTypePromptPlaceholder };
