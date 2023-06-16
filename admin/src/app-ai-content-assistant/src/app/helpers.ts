
import { GeneratorAction, UrlStatus, UrlsListItem } from './types';

export const applyGeneratorAction = ( action: GeneratorAction ) => {
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

export const getUrlStatus = ( status: string ): UrlStatus => {
	switch ( status ) {
	case 'U':
	case 'A':
		return 'active';
	case 'P':
	case 'N':
		return 'pending';
	case 'E':
	default:
		return 'error';
	}
};

export const getActiveUrls = ( urls: UrlsListItem[] ) => {
	return urls
		.filter( ( item ) => item.status === 'active' )
		.map( ( item ) => item.url );
};
