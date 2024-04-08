import { GeneratorAction, UrlStatus, UrlsListItem } from './types';
import { __ } from '@wordpress/i18n';

export const applyGeneratorAction = ( action: GeneratorAction ) => {
	switch ( action.type ) {
	case 'fix_grammar':
		return `${ __( 'Fix the spelling and grammar of the following TEXT. TEXT:', 'wp-urlslab' ) } ${ action.text }`;
	case 'make_longer':
		return `${ __( 'Make longer following TEXT. TEXT:', 'wp-urlslab' ) } ${ action.text }`;
	case 'make_shorter':
		return `${ __( 'Make shorter following TEXT. TEXT:', 'wp-urlslab' ) } ${ action.text }`;
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
