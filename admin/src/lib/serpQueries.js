import { postFetch } from '../api/fetching';
import { setNotification } from '../hooks/useNotifications';

export const getTopUrls = async ( query, country = 'us', domain_type, limit ) => {
	const res = await postFetch( 'serp-queries/query/top-urls', { query, country, domain_type, limit } );
	const rsp = await res.json();
	if ( res.ok ) {
		return rsp;
	}

	setNotification( 0, { message: rsp.message, status: 'error' } );
};

export const getQueryClusterKeywords = async ( { query, country = 'us', max_position = 10, competitors = 4 } ) => {
	const res = await postFetch( 'serp-queries/query-cluster', { query, country, max_position, competitors } );
	if ( res.ok ) {
		return await res.json();
	}
};
