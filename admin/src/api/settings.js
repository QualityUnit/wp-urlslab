export async function fetchSettings( slug ) {
	try {
		const result = await fetch( `../wp-json/urlslab/v1/settings/${ slug }/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} );
		return await result.json();
	} catch ( error ) {
		return false;
	}
}

export async function setSettings( slug, object ) {
	try {
		const result = await fetch( `../wp-json/urlslab/v1/settings/${ slug }`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
			body: JSON.stringify( object ),
		} );
		return result;
	} catch ( error ) {
		return false;
	}
}
