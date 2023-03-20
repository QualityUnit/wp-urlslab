import { langName } from '../constants/helpers';
const langPairs = { all: 'All' };

export async function fetchLangs( ) {
	try {
		const response = await fetch( '/wp-json/urlslab/v1', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} );

		const data = await response.json();
		const langs = data?.routes[ '/urlslab/v1' ].endpoints[ 0 ].args.wpml_language.enum;
		if ( langs.length ) {
			langs.forEach( ( lang ) => {
				langPairs[ lang ] = langName( lang );
			} );
			return langPairs;
		}
		return undefined;
	} catch ( error ) {
		return false;
	}
}
