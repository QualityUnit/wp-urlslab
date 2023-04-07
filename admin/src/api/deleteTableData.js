export async function deleteAll( slug ) {
	try {
		const result = await fetch( `/wp-json/urlslab/v1${ slug ? `/${ slug }/delete-all` : '' }`, {
			method: 'DELETE',
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

export async function deleteRow( slug ) {
	try {
		const result = await fetch( `/wp-json/urlslab/v1${ slug ? `/${ slug }` : '' }`, {
			method: 'DELETE',
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
