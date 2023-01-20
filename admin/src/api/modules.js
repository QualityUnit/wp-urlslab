import apiFetch from '@wordpress/api-fetch';

export async function fetchModules(slug) {
	try {
		const result = await apiFetch( {
			method: 'GET',
			path: `/wp-json/urlslab/v1/module${slug ? `/${slug}`:''}`,
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} ).then( ( data ) => {
			return data;
		} );
		return result;
	} catch ( error ) {
		return false;
	}
}

export async function fetchSettings(slug) {
	try {
		const result = await apiFetch( {
			method: 'GET',
			path: `/wp-json/urlslab/v1/settings/${slug}/`,
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} ).then( ( data ) => {
			return data;
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
