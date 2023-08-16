import { postFetch } from '../api/fetching';

export const getTopUrls = async ( query, domain_type, limit ) => {
	const res = await postFetch( 'serp-queries/query/top-urls', { query, domain_type, limit } );
	if ( res.ok ) {
		return await res.json();
	}
};

export const getQueryClusterKeywords = async ( query, max_position = 10, competitors = 4, with_stats = false ) => {
	const res = await postFetch( 'serp-queries/query-cluster', { query, max_position, competitors, with_stats } );
	if ( res.ok ) {
		return await res.json();
	}
};
