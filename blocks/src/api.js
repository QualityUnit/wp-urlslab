/*global wpApiSettings*/

export const fetchModuleOptions = async ( {
	moduleId, //example: urlslab-related-resources
}
) => {
	try {
		return fetch( wpApiSettings.root + `urlslab/v1/settings/${ moduleId }/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': wpApiSettings.nonce,
			},
			credentials: 'include',
		} ).then( ( response ) => {
			if ( response.ok ) {
				return response.json();
			}
			return null;
		} ).catch( ( error ) => {
			// eslint-disable-next-line no-console
			console.error( 'Error:', error );
			return null;
		} );
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.error( 'Error:', error );
		return null;
	}
};

export async function getFetch( slug ) {
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

		return result;
	} catch ( error ) {
		return false;
	}
}

export async function postFetch( slug, object, options ) {
	try {
		const result = await fetch( wpApiSettings.root + `urlslab/v1/${ slug }`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
			body: JSON.stringify( { ...object } ),
			signal: options?.signal,
		} );

		// // if error handling is managed elsewhere, we can skip
		// if (!options?.skipErrorHandling === true) {
		// 	handleApiError(slug, result);
		// }

		return result;
	} catch ( error ) {
		return false;
	}
}

export const fetchModule = async ( slug ) => {
	const response = await getFetch( `module/${ slug }` ).then( ( data ) => data );
	if ( response.ok ) {
		return response.json();
	}
	return response;
};

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
