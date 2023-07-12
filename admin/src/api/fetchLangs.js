/* global wpApiSettings */

import { langName } from '../lib/helpers';

export async function fetchLangs( ) {
	const langPairs = {};
	try {
		const response = await fetch( wpApiSettings.root + 'urlslab/v1/language', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} );

		if ( response.ok ) {
			const langs = await response.json();
			if ( langs?.length ) {
				langs.forEach( ( lang ) => {
					langPairs[ lang.code ] = langName( lang.code );
				} );
				return langPairs;
			}
		}
	} catch ( error ) {
		return false;
	}
}
