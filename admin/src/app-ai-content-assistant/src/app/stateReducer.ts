import { UrlsListItem, UrlsList } from './types';

export type ReducerAction = {
    type : keyof typeof defaults,
    payload: ( typeof defaults )[keyof typeof defaults]
}
export type AppState = typeof defaults;

export const defaults = {
	template: '',
	prompt: '',
	language: 'en',
	audience: '',
	tone: '',
	length: 10,
	ai_model: 'gpt-3.5-turbo',
	semantic_context: {
		urls: [] as UrlsList,
	},
	generatedResults: {
		text: '',
		loading: false,
		opened: false, // this allow us to keep results opened once the complete endpoint return some value, we cannot depend on empty result text as text can be edited/removed by user in textarea
	},
};

export const reducer = ( state: AppState, action: ReducerAction ) => {
	const { type, payload } = action;
	if ( type === 'semantic_context' ) {
		const newValue: UrlsListItem = {
			id: ( state.semantic_context.urls.length + 1 ).toString(),
			status: 'active', // we'll use 'pending' status in further release of plugin
			url: payload as string,
		};

		return {
			...state,
			semantic_context: {
				urls: [ ...state.semantic_context.urls, newValue ],
			},
		};
	}
	return {
		...state,
		[ type ]: payload,
	};
};
