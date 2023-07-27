/* global wpApiSettings */

export async function deleteAll( slug ) {
	try {
		const result = await fetch( wpApiSettings.root + `urlslab/v1${ slug ? `/${ slug }/delete-all` : '' }`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} );
		return result;
	} catch ( error ) {
		return false;
	}
}

export async function deleteRow( slug, objArray ) {
	try {
		const result = await fetch( wpApiSettings.root + `urlslab/v1${ slug ? `/${ slug }/delete` : '' }`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
			body: JSON.stringify( { rows: objArray } ),
		} );
		return result;
	} catch ( error ) {
		return false;
	}
}
