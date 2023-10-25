import { postFetch } from '../api/fetching';

export const getQueryUrls = async ( { query, country = 'us', domain_type, limit, sorting } ) => {
	const response = await postFetch( 'serp-queries/query/query-urls', { query, country, domain_type, limit, sorting } );
	if ( response.ok ) {
		return await response.json();
	}
};

export const getTopUrls = async ( { query, country = 'us', domain_type, limit, sorting, filters } ) => {
	const response = await postFetch( 'serp-queries/query/top-urls', { query, country, domain_type, limit, sorting, filters } );
	if ( response.ok ) {
		return await response.json();
	}
	return [];
};

export const getQueryClusterKeywords = async ( { query, country = 'us', max_position = 10, competitors = 4, sorting, filters, limit = 100 } ) => {
	const response = await postFetch( 'serp-queries/query-cluster', { query, country, max_position, competitors, sorting, filters, rows_per_page: limit } );
	if ( response.ok ) {
		return await response.json();
	}
	return [];
};
