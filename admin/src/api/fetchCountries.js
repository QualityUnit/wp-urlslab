/* global wpApiSettings */

import { countryName } from '../lib/helpers';

export async function fetchCountries( ) {
	const countryPairs = {};
	try {
		const response = await fetch( wpApiSettings.root + 'urlslab/v1/country', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} );

		if ( response.ok ) {
			const countries = await response.json();
			if ( countries?.length ) {
				countries.forEach( ( country ) => {
					countryPairs[ country.code ] = countryName( country.code );
				} );
				return countryPairs;
			}
		}
	} catch ( error ) {
		return false;
	}
}
