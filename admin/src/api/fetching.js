/* global wpApiSettings */
export async function fetchData( slug ) {
	try {
		const result = await fetch( wpApiSettings.root + `urlslab/v1${ slug ? `/${ slug }` : '' }`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} );
		if ( result.ok ) {
			return await result.json();
		}
		return undefined;
	} catch ( error ) {
		return false;
	}
}

export async function setModule( slug, object ) {
	try {
		const result = await fetch( wpApiSettings.root + `urlslab/v1/module/${ slug }`, {
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

export async function setData( slug, object ) {
	try {
		const result = await fetch( wpApiSettings.root + `urlslab/v1/${ slug }`, {
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
