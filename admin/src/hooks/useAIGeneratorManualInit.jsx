import { useEffect } from 'react';

import useAIGenerator from './useAIGenerator';
import { getQueryCluster, getTopUrls } from '../lib/aiGeneratorPanel';
import { getPromptTemplates } from '../api/generatorApi';
import usePromptTemplateQuery from '../queries/usePromptTemplateQuery';
import useAIModelsQuery from '../queries/useAIModelsQuery';

const useAIGeneratorManualInit = ( { initialData } ) => {
	const { aiGeneratorConfig, setAIGeneratorConfig, setAIGeneratorManualHelpers } = useAIGenerator();

	// preload queries to possibly show values inside related step immediately
	usePromptTemplateQuery( initialData.initialPromptType ? initialData.initialPromptType : null );
	useAIModelsQuery();

	useEffect( () => {
		// setting initial state
		const initialConf = { ...aiGeneratorConfig, ...initialData };
		setAIGeneratorConfig( initialConf );

		const fetchTopUrls = async () => {
			setAIGeneratorManualHelpers( { loadingTopUrls: true } );
			const topUrls = await getTopUrls( initialConf.keywordsList );
			setAIGeneratorConfig( { serpUrlsList: topUrls } );
			setAIGeneratorManualHelpers( { loadingTopUrls: false } );
		};

		const fetchQueryCluster = async () => {
			const primaryKeyword = initialConf.keywordsList[ 0 ].q;
			if ( primaryKeyword ) {
				const queryCluster = await getQueryCluster( primaryKeyword );
				setAIGeneratorConfig( { keywordsList: [ { q: primaryKeyword, checked: true }, ...queryCluster ] } );
			}
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
					setAIGeneratorConfig( { promptTemplate: data[ 0 ].prompt_template } );
					setAIGeneratorManualHelpers( { templateName: data[ 0 ].template_name } );
				}
			}
		};

		if (
			initialConf.dataSource === 'SERP_CONTEXT'
			// do not process following conditions, fetch urls everytime the generator is initialized
			// it solve issues when user changes Question in FAQs and reopen generator again etc....
			//initialConf.keywordsList.length > 0 &&
			//initialConf.keywordsList[ 0 ].q !== '' &&
			//initialConf.serpUrlsList.length <= 0
		) {
			fetchTopUrls();
		}

		if ( initialConf.keywordsList.length > 0 && initialConf.keywordsList[ 0 ].q !== '' ) {
			fetchQueryCluster();
		}

		if ( initialConf.initialPromptType && initialConf.initialPromptType !== 'G' ) {
			getInitialPromptTemplate();
		}
	}, [] );
};

export default useAIGeneratorManualInit;
