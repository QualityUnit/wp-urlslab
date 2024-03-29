import { Reducer } from 'react';
import { UrlsListItem, AppState, ReducerAction } from './types';

export const defaults = {
	template: '',
	prompt: '',
	language: 'en',
	audience: '',
	tone: '',
	length: 10,
	semantic_context: '',
	ai_model: 'gpt-3.5-turbo-1106',
	url_filter: [] as UrlsListItem[],
	selected_urls: [] as string[],
	generatedResults: {
		text: '',
		loading: false,
		opened: false, // this allow us to keep results opened once the complete endpoint return some value, we cannot depend on empty result text as text can be edited/removed by user in textarea
	},
};

export const reducer:Reducer<AppState, ReducerAction> = ( state, action ) => {
	const { type, payload } = action;
	if ( type === 'url_filter' && typeof payload === 'object' && 'status' in payload ) {
		if ( payload.status === 'pending' ) {
			return state.url_filter.filter( ( item ) => item.url === payload.url ).length !== 0
				? state
				: {
					...state,
					url_filter: [
						...state.url_filter,
						{
							id: ( state.url_filter.length + 1 ).toString(),
							status: 'pending',
							url: payload.url as string,
						},
					],
				};
		}

		return {
			...state,
			url_filter: state.url_filter.map( ( item ) => {
				return item.url === payload.url
					? { ...item, status: payload.status }
					: item;
			} ),
		};
	}
	return {
		...state,
		[ type ]: payload,
	};
};
