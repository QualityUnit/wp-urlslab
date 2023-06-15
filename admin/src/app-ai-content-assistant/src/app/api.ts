import { AppState, ReducerAction } from './stateReducer';
import { __ } from '@wordpress/i18n';
import { GeneratorAction } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const wpApiSettings: any;

export const runResultsGenerator = async (
	data: { state: AppState, dispatch: React.Dispatch<ReducerAction> },
	action?: GeneratorAction,
) => {
	const { state, dispatch } = data;
	dispatch( { type: 'generatedResults', payload: { ...state.generatedResults, loading: true } } );

	const result = await fetchResult( state, action );
	if ( result && result.completion ) {
		dispatch( { type: 'generatedResults', payload: { text: result.completion, loading: false, opened: true } } );
		return;
	}
	if ( ! result || result?.error ) {
		//handle error in future
		dispatch( { type: 'generatedResults', payload: { ...state.generatedResults, loading: false } } );
		return;
	}
	dispatch( { type: 'generatedResults', payload: { ...state.generatedResults, loading: false } } );
};

const fetchResult = async (
	data: AppState,
	action?: GeneratorAction,
) => {
	const inputData = {
		user_prompt: action ? applyGeneratorAction( action ) : data.prompt,
		tone: data.tone,
		model: data.ai_model,
		lang: data.language,
		semantic_context: '', // example: 'pricing',
		url_filter: data.semantic_context.urls ? data.semantic_context.urls.map( ( item ) => {
			return item.url;
		} ) : [],
		//domain_filters: [], // example [ 'https://liveagent.com' ],
	};

	if ( ! wpApiSettings ) {
		return;
	}

	try {
		return fetch( wpApiSettings.root + 'urlslab/v1/generator/complete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': wpApiSettings.nonce,
			},
			credentials: 'include',
			body: JSON.stringify( inputData ),
		} ).then( ( response ) => {
			if ( response.ok ) {
				return response.json();
			}

			// show generic error if it's not 404
			return {
				error: response.status === 404 ? __( 'Urls not found. Check used urls or try again later.' ) : __( 'Failed to load data.' ),
			};
		} ).catch( ( error ) => {
			console.error( 'Error:', error );
			return null;
		} );
	} catch ( error ) {
		console.error( 'Error:', error );
		return null;
	}
};

const applyGeneratorAction = ( action: GeneratorAction ) => {
	switch ( action.type ) {
	case 'fix_grammar':
		return `Fix the spelling and grammar of the following TEXT. TEXT: ${ action.text }`;
	case 'make_longer':
		return `Make longer following TEXT. TEXT: ${ action.text }`;
	case 'make_shorter':
		return `Make shorter following TEXT. TEXT: ${ action.text }`;
	default:
		return action.text;
	}
};
