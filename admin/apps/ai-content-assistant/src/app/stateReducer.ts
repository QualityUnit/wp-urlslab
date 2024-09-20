import { Reducer } from 'react';
import { AppState, ReducerAction } from './types';

export const defaults = {
	template: '',
	prompt: '',
	language: 'en',
	audience: '',
	tone: '',
	length: 10,
	ai_model: 'gpt-3.5-turbo-1106',
	selected_urls: [] as string[],
	generatedResults: {
		text: '',
		loading: false,
		opened: false, // this allow us to keep results opened once the complete endpoint return some value, we cannot depend on empty result text as text can be edited/removed by user in textarea
	},
};

export const reducer:Reducer<AppState, ReducerAction> = ( state, action ) => {
	const { type, payload } = action;
	return {
		...state,
		[ type ]: payload,
	};
};
