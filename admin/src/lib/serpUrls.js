import { postFetch } from '../api/fetching';
import useNotifications, { setNotification } from '../hooks/useNotifications';

export const getMyUrls = async ( url ) => {
	const res = await postFetch( 'serp-urls/url/my-urls', { url } );
	const rsp = await res.json();
	if ( res.ok ) {
		return rsp;
	}

	setNotification( 0, { message: rsp.message, status: 'error' } );
};
export const getCompetitorUrls = async ( url ) => {
	const res = await postFetch( 'serp-urls/url/comp-urls', { url } );
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
