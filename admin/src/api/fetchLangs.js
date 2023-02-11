export async function fetchWPML( ) {
	try {
		const result = await fetch( '/wp-json/wpml/tm/v1', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} ).then( ( response ) => {
			return response.json();
		} ).then( ( data ) => {
			return data.routes[ '/wpml/tm/v1' ].endpoints[ 0 ].args.wpml_language.enum;
		} );
		return result;
	} catch ( error ) {
		return false;
	}
}
