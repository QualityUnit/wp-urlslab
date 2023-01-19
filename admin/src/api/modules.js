import apiFetch from '@wordpress/api-fetch';

export async function fetchModules() {
	try {
		const result = await apiFetch( {
			method: 'GET',
			path: `/wp-json/urlslab/v1/module`,
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} ).then( ( ModulesData ) => {
			return ModulesData;
		} );
		return result;
	} catch ( error ) {
		return false;
	}
}

export async function setModule( slug, object ) {
	try {
		const result = await apiFetch( {
			method: 'POST',
			path: `/wp-json/urlslab/v1/module/${ slug }`,
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
			data: object,
		} );
		return result;
	} catch ( error ) {
		return false;
	}
}
