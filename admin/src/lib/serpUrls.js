import { postFetch } from '../api/fetching';
import useNotifications, { setNotification } from '../hooks/useNotifications';

export const getSimilarUrls = async ( url ) => {
	const res = await postFetch( 'serp-urls/url/similar-urls', { url } );
	const rsp = await res.json();
	if ( res.ok ) {
		return rsp;
	}

	setNotification( 0, { message: rsp.message, status: 'error' } );
};

export const getUrlQueries = async ( url ) => {
	const res = await postFetch( 'serp-urls/url/queries', { url } );
	if ( res.ok ) {
		return await res.json();
	}
};
