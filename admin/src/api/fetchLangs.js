import { langName } from '../constants/helpers';
const langPairs = {};

export async function fetchWPML( ) {
	try {
		const response = await fetch( '/wp-json/wpml/tm/v1', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} );

		const data = await response.json();
		const langs = data.routes[ '/wpml/tm/v1' ].endpoints[ 0 ].args.wpml_language.enum;
		langs.forEach( ( lang ) => {
			langPairs[ lang ] = langName( lang );
		} );
		return langPairs;
	} catch ( error ) {
		return false;
	}
}
