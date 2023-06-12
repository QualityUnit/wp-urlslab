export const isValidUrl = ( url: string ) => {
	try {
		return Boolean( new URL( url ) );
	} catch ( error ) {
		return false;
	}
};
