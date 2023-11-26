import {__} from "@wordpress/i18n";

const httpStatusTypes = {
	'-2': __( 'Processing' ),
	'-1': __( 'Waiting' ),
	200: __( 'Valid' ),
	400: __( '400 Client Error' ),
	401: __( '401 Unauthorized' ),
	301: __( 'Moved Permanently' ),
	302: __( 'Found, Moved temporarily' ),
	307: __( 'Temporary Redirect' ),
	308: __( 'Permanent Redirect' ),
	404: __( '404 Not Found' ),
	405: __( '405 Method Not Allowed' ),
	406: __( '406 Not Acceptable' ),
	410: __( '410 Gone' ),
	403: __( '403 Forbidden' ),
	500: __( '500 Internal Server Error' ),
	503: __( '503 Service Unavailable' ),
};
export default httpStatusTypes;
