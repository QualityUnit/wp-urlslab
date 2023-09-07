import { useEffect } from 'react';

import useAIGenerator from './useAIGenerator';
import { getQueryCluster, getTopUrls } from '../lib/aiGeneratorPanel';
import { getPromptTemplates } from '../api/generatorApi';
import usePromptTemplateQuery from '../queries/usePromptTemplateQuery';
import useAIModelsQuery from '../queries/useAIModelsQuery';

const useAIGeneratorManualInit = ( { initialData } ) => {
	const { aiGeneratorConfig, setAIGeneratorConfig, setAIGeneratorManualHelpers } = useAIGenerator();

	// preload queries to possibly show values inside related step immediately
	usePromptTemplateQuery();
	useAIModelsQuery();

	useEffect( () => {
		// setting initial state
		const initialConf = { ...aiGeneratorConfig, ...initialData };
		setAIGeneratorConfig( initialConf );

		const fetchTopUrls = async () => {
			const topUrls = await getTopUrls( initialConf );
			setAIGeneratorConfig( { serpUrlsList: topUrls } );
		};

		const fetchQueryCluster = async () => {
			const primaryKeyword = aiGeneratorConfig.keywordsList[ 0 ].q;
			const queryCluster = await getQueryCluster( primaryKeyword );
			setAIGeneratorConfig( { keywordsList: [ { q: primaryKeyword, checked: true }, ...queryCluster ] } );
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
			initialConf.dataSource === 'SERP_CONTEXT' &&
			initialConf.keywordsList.length > 0 &&
			initialConf.keywordsList[ 0 ].q !== '' &&
			initialConf.serpUrlsList.length <= 0
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
