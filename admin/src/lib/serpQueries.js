import { postFetch } from '../api/fetching';
import { setNotification } from '../hooks/useNotifications';

export const getQueryUrls = async ( { query, country = 'us', domain_type, limit, sorting } ) => {
	const res = await postFetch( 'serp-queries/query/query-urls', { query, country, domain_type, limit, sorting } );
	const rsp = await res.json();
	if ( res.ok ) {
		return rsp;
	}

	setNotification( 0, { message: rsp.message, status: 'error' } );
};

export const getTopUrls = async ( { query, country = 'us', domain_type, limit, sorting, filters } ) => {
	const res = await postFetch( 'serp-queries/query/top-urls', { query, country, domain_type, limit, sorting, filters } );
	const rsp = await res.json();
	if ( res.ok ) {
		return rsp;
	}
	setNotification( 0, { message: rsp.message, status: 'error' } );
	return [];
};

export const getQueryClusterKeywords = async ( { query, country = 'us', max_position = 10, competitors = 4, sorting, filters, limit = 100 } ) => {
	const res = await postFetch( 'serp-queries/query-cluster', { query, country, max_position, competitors, sorting, filters, rows_per_page: limit } );
	if ( res.ok ) {
		return await res.json();
	}
	return [];
};
