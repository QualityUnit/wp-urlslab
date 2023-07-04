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
