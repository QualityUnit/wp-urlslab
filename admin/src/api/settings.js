import apiFetch from '@wordpress/api-fetch';

export async function fetchSettings( slug ) {
	try {
		const result = await apiFetch( {
			method: 'GET',
			path: `/wp-json/urlslab/v1/settings/${ slug }/`,
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} ).then( ( data ) => {
			return data;
		} );
		return result;
	} catch ( error ) {
		return false;
	}
}

export function processSettings( settingsObject ) {
	if ( settingsObject && Object.keys( settingsObject ).length === 0 ) {
		return false;
	}

	// for ( let i = 0; i < settingsObject.length; i++ ) {
	// 	const element = settingsObject
	// }
	return settingsObject;
	// Object.keys( settingsObject ).map( ( obj ) => {
	// 	return obj;
	// } );
}
