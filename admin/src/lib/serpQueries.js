import { postFetch } from '../api/fetching';
import useNotifications, { setNotification } from '../hooks/useNotifications';

export const getTopUrls = async ( query, domain_type, limit ) => {
	const res = await postFetch( 'serp-queries/query/top-urls', { query, domain_type, limit } );
	const rsp = await res.json();
	if ( res.ok ) {
		return rsp;
	}

	setNotification( 0, { message: rsp.message, status: 'error' } );
};

export const getQueryClusterKeywords = async ( query, max_position = 10, competitors = 4, with_stats = false ) => {
	const res = await postFetch( 'serp-queries/query-cluster', { query, max_position, competitors, with_stats } );
	if ( res.ok ) {
		return await res.json();
	}
};
