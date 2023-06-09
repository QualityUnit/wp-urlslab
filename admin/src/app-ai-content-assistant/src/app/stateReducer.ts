import { fakeUrls } from './fakeData';
import { UrlsList } from './types';

export type ReducerAction = {
    type : keyof typeof defaults,
    payload: ( typeof defaults )[keyof typeof defaults]
}
export type AppState = typeof defaults;

export const defaults = {
	template: '',
	prompt: '',
	generated_text: '',
	language: '',
	audience: '',
	tone: '',
	length: 10,
	ai_model: 'gpt-3.5-turbo',
	semantic_context: {
		urls: fakeUrls as UrlsList,
	},
};

export const reducer = ( state: AppState, action: ReducerAction ) => {
	const { type, payload } = action;
	console.log( action );
	return {
		...state,
		[ type ]: payload,
	};
};
