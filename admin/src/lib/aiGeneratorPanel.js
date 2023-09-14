// handling generating final prompt based on prompt template variables
import {
	augmentWithDomainContext,
	augmentWithoutContext,
	augmentWithURLContext,
} from '../api/generatorApi';
import { getQueryClusterKeywords, getTopUrls as getTopQueryUrls } from './serpQueries';

const handleGeneratePrompt = ( aiGeneratorConfig ) => {
	const selectedKeywords = getSelectedKeywords( aiGeneratorConfig.keywordsList );
	let finalPrompt = aiGeneratorConfig.promptTemplate;

	if ( finalPrompt.includes( '{keywords}' ) && selectedKeywords.length > 0 ) {
		finalPrompt = finalPrompt.replace( '{keywords}', selectedKeywords.join( ', ' ) );
	}

	if ( finalPrompt.includes( '{primary_keyword}' ) && selectedKeywords.length > 0 ) {
		finalPrompt = finalPrompt.replace( '{primary_keyword}', selectedKeywords[ 0 ] );
	}

	if ( finalPrompt.includes( '{language}' ) ) {
		finalPrompt = finalPrompt.replace( '{language}', aiGeneratorConfig.lang );
	}

	if ( finalPrompt.includes( '{title}' ) ) {
		finalPrompt = finalPrompt.replace( '{title}', aiGeneratorConfig.title );
	}

	return finalPrompt;
};

// handling serp context selection - fetching top serp results
const getTopUrls = async ( keywordsList ) => {
	if ( keywordsList.length > 0 ) {
		const primaryKeyword = getSelectedKeywords( keywordsList )[ 0 ];
		const urls = await getTopQueryUrls( primaryKeyword );
		if ( ! urls ) {
			return [];
		}
		return urls.map( ( url ) => {
			return { ...url, checked: false };
		} );
	}
	return [];
};

const getQueryCluster = async ( val ) => {
	if ( val === '' ) {
		return [];
	}
	try {
		const keywords = await getQueryClusterKeywords( val );
		return keywords.filter( ( keyword ) => keyword.query !== val )
			.map( ( keyword ) => {
				return { q: keyword.query, checked: false };
			} );
	} catch ( error ) {
		return [];
	}
};

// handling generate content
const generateContent = async ( aiGeneratorConfig, promptVal ) => {
	try {
		/// getting he Process ID for Generation
		let processIdResponse;

		if ( aiGeneratorConfig.dataSource === 'NO_CONTEXT' ) {
			processIdResponse = await augmentWithoutContext( promptVal, aiGeneratorConfig.modelName );
		}

		if ( aiGeneratorConfig.dataSource === 'DOMAIN_CONTEXT' ) {
			processIdResponse = await augmentWithDomainContext( aiGeneratorConfig.domain, promptVal, aiGeneratorConfig.modelName, aiGeneratorConfig.semanticContext );
		}

		if ( aiGeneratorConfig.dataSource === 'SERP_CONTEXT' ) {
			processIdResponse = await augmentWithURLContext(
				[ ...aiGeneratorConfig.serpUrlsList.filter( ( url ) => url.checked ).map( ( url ) => url.url_name ) ],
				promptVal,
				aiGeneratorConfig.modelName
			);
		}

		if ( aiGeneratorConfig.dataSource === 'URL_CONTEXT' ) {
			processIdResponse = await augmentWithURLContext( [ ...aiGeneratorConfig.urlsList ], promptVal, aiGeneratorConfig.modelName );
		}

		if ( processIdResponse.ok ) {
			const rsp = await processIdResponse.json();
			return rsp.processId;
		}
		const rsp = await processIdResponse.json();
		throw new Error( rsp.message );
	} catch ( error ) {
		throw error;
	}
};

// selected keywords
const getSelectedKeywords = ( keywordsList ) => {
	return keywordsList.filter( ( keyword ) => keyword.checked ).map( ( keyword ) => keyword.q );
};

export { handleGeneratePrompt, getTopUrls, generateContent, getQueryCluster };
