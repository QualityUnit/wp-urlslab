// handling generating final prompt based on prompt template variables
import {
	augmentWithDomainContext,
	augmentWithoutContext,
	augmentWithURLContext,
} from '../api/generatorApi';
import { getQueryClusterKeywords, getQueryUrls } from './serpQueries';

const handleGeneratePrompt = ( aiGeneratorConfig ) => {
	const selectedKeywords = getSelectedKeywords( aiGeneratorConfig.keywordsList );
	let finalPrompt = aiGeneratorConfig.promptTemplate;

	if ( finalPrompt.includes( '{keywords}' ) && selectedKeywords.length > 0 ) {
		finalPrompt = finalPrompt.replaceAll( '{keywords}', selectedKeywords.join( ', ' ) );
	}

	if ( finalPrompt.includes( '{primary_keyword}' ) && selectedKeywords.length > 0 ) {
		finalPrompt = finalPrompt.replaceAll( '{primary_keyword}', selectedKeywords[ 0 ] );
	}

	if ( finalPrompt.includes( '{question}' ) && selectedKeywords.length > 0 ) {
		finalPrompt = finalPrompt.replaceAll( '{question}', selectedKeywords[ 0 ] );
	}

	if ( finalPrompt.includes( '{language}' ) ) {
		finalPrompt = finalPrompt.replaceAll( '{language}', aiGeneratorConfig.lang );
	}

	if ( finalPrompt.includes( '{title}' ) ) {
		finalPrompt = finalPrompt.replaceAll( '{title}', aiGeneratorConfig.title );
	}

	return finalPrompt;
};

// handling serp context selection - fetching top serp results
const getTopUrls = async ( { query, country } ) => {
	if ( query?.length > 0 ) {
		const primaryKeyword = getSelectedKeywords( query )[ 0 ];
		const urls = await getQueryUrls( { query: primaryKeyword, country } );
		if ( urls && Array.isArray( urls ) ) {
			return urls.map( ( url ) => {
				return { ...url, checked: false };
			} );
		}
	}
	return [];
};

const getQueryCluster = async ( { query, country } ) => {
	if ( query === '' ) {
		return [];
	}
	try {
		const keywords = await getQueryClusterKeywords( { query, country, competitors: 2, limit: 10 } );
		return keywords
			.filter( ( keyword ) => keyword.query !== query )
			.map( ( keyword ) => ( { q: keyword.query, checked: false } ) );
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
