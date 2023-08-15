// handling generating final prompt based on prompt template variables
import {
	augmentWithDomainContext,
	augmentWithoutContext,
	augmentWithURLContext,
} from '../api/generatorApi';
import { getQueryClusterKeywords, getTopUrls as getTopQueryUrls } from './serpQueries';

const handleGeneratePrompt = ( aiGeneratorConfig, val ) => {
	let finalPrompt = val;
	const selectedKeywords = getSelectedKeywords( aiGeneratorConfig );
	if ( val.includes( '{keywords}' ) && selectedKeywords.length > 0 ) {
		console.log('includes keywords')
		finalPrompt = val.replace( '{keywords}', selectedKeywords.join( ', ' ) );
	}

	if ( val.includes( '{primary_keyword}' ) && selectedKeywords.length > 0 ) {
		console.log('includes primary keywords')
		finalPrompt = val.replace( '{primary_keyword}', selectedKeywords[ 0 ] );
	}

	if ( val.includes( '{language}' ) && aiGeneratorConfig.lang ) {
		console.log('includes kang')
		finalPrompt = val.replace( '{language}', aiGeneratorConfig.lang );
	}

	if ( val.includes( '{title}' ) && aiGeneratorConfig.title ) {
		console.log('includes title')
		finalPrompt = val.replace( '{title}', aiGeneratorConfig.title );
	}

	return finalPrompt;
};

// handling serp context selection - fetching top serp results
const getTopUrls = async ( aiGeneratorConfig ) => {
	const primaryKeyword = getSelectedKeywords( aiGeneratorConfig )[ 0 ];
	const urls = await getTopQueryUrls( primaryKeyword );
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
		}
		const rsp = await processIdResponse.json();
		throw new Error( rsp.message );
	} catch ( error ) {
		throw error;
	}
};

// selected keywords
const getSelectedKeywords = ( aiGeneratorConfig ) => {
	return aiGeneratorConfig.keywordsList.filter( ( keyword ) => keyword.checked ).map( ( keyword ) => keyword.q );
};

export { handleGeneratePrompt, getTopUrls, generateContent, getQueryCluster };
