// handling generating final prompt based on prompt template variables
import { postFetch } from '../api/fetching';
import {
	augmentWithDomainContext,
	augmentWithoutContext,
	augmentWithURLContext,
} from '../api/generatorApi';
import {getQueryClusterKeywords} from "./serpQueries";

const handleGeneratePrompt = ( aiGeneratorConfig, val ) => {
	let finalPrompt = val;
	const selectedKeywords = getSelectedKeywords( aiGeneratorConfig );
	if ( val.includes( '{keyword}' ) && selectedKeywords.length > 0 ) {
		finalPrompt = val.replace( '{keyword}', selectedKeywords.join( ', ' ) );
	}

	if ( val.includes( '{primary_keyword}' ) && selectedKeywords.length > 0 ) {
		finalPrompt = val.replace( '{primary_keyword}', selectedKeywords[ 0 ] );
	}

	if ( val.includes( '{language}' ) && aiGeneratorConfig.language ) {
		finalPrompt = val.replace( '{language}', aiGeneratorConfig.language );
	}

	return finalPrompt;
};

// handling serp context selection - fetching top serp results
const getTopUrls = async ( aiGeneratorConfig ) => {
	const primaryKeyword = getSelectedKeywords( aiGeneratorConfig )[ 0 ];
	const urls = await getTopUrls( primaryKeyword );
	return urls.map( ( url ) => {
		return { ...url, checked: false };
	} );
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
const generateContent = async ( aiGeneratorConfig ) => {
	try {
		/// getting he Process ID for Generation
		let processIdResponse;

		if ( aiGeneratorConfig.dataSource === 'NO_CONTEXT' ) {
			processIdResponse = await augmentWithoutContext( aiGeneratorConfig.promptVal, aiGeneratorConfig.modelName );
		}

		if ( aiGeneratorConfig.dataSource === 'DOMAIN_CONTEXT' ) {
			processIdResponse = await augmentWithDomainContext( aiGeneratorConfig.domain, aiGeneratorConfig.promptVal, aiGeneratorConfig.modelName, aiGeneratorConfig.semanticContext );
		}

		if ( aiGeneratorConfig.dataSource === 'SERP_CONTEXT' ) {
			processIdResponse = await augmentWithURLContext(
				[ ...aiGeneratorConfig.serpUrlsList.filter( ( url ) => url.checked ).map( ( url ) => url.url_name ) ],
				aiGeneratorConfig.promptVal,
				aiGeneratorConfig.modelName
			);
		}

		if ( aiGeneratorConfig.dataSource === 'URL_CONTEXT' ) {
			processIdResponse = await augmentWithURLContext( [ ...aiGeneratorConfig.urlsList ], aiGeneratorConfig.promptVal, aiGeneratorConfig.modelName );
		}

		if ( processIdResponse.ok ) {
			const rsp = await processIdResponse.json();
			return rsp.processId;
		} else {
			const rsp = await processIdResponse.json();
			throw new Error( rsp.message );
		}
	} catch ( error ) {
		throw error;
	}
};

// selected keywords
const getSelectedKeywords = ( aiGeneratorConfig ) => {
	return aiGeneratorConfig.keywordsList.filter( ( keyword ) => keyword.checked ).map( ( keyword ) => keyword.q );
};

export { handleGeneratePrompt, getTopUrls, generateContent, getQueryCluster };
