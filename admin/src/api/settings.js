/* global wpApiSettings */

import { handleApiError } from './fetching';

export async function fetchSettings( slug, options ) {
	try {
		const result = await fetch( wpApiSettings.root + `urlslab/v1/settings/${ slug }/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} );
		// if error handling is managed elsewhere, we can skip
		if ( ! options?.skipErrorHandling === true ) {
			handleApiError( slug, result );
		}
		return await result.json();
	} catch ( error ) {
		return false;
	}
}

export async function setSettings( slug, object, options ) {
	try {
		const result = await fetch( wpApiSettings.root + `urlslab/v1/settings/${ slug }`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
			body: JSON.stringify( object ),
		} );
		// if error handling is managed elsewhere, we can skip
		if ( ! options?.skipErrorHandling === true ) {
			handleApiError( slug, result );
		}
		return result;
	} catch ( error ) {
		return false;
	}
}
