import { __ } from '@wordpress/i18n';

export const header = Object.freeze( {
	match_type: __( 'Match type', 'urlslab' ),
	match_url: __( 'URL', 'urlslab' ),
	replace_url: __( 'Redirect to', 'urlslab' ),
	redirect_code: __( 'HTTP code', 'urlslab' ),
	if_not_found: __( 'Page status', 'urlslab' ),
	is_logged: __( 'Is logged in', 'urlslab' ),
	ip: __( 'Visitor IP', 'urlslab' ),
	roles: __( 'Roles', 'urlslab' ),
	capabilities: __( 'Capabilities', 'urlslab' ),
	browser: __( 'Browser', 'urlslab' ),
	cookie: __( 'Cookies', 'urlslab' ),
	headers: __( 'Request headers', 'urlslab' ),
	params: __( 'Request parameters', 'urlslab' ),
	cnt: __( 'Redirects count', 'urlslab' ),
	labels: __( 'Tags', 'urlslab' ),
	created: __( 'Created', 'urlslab' ),
} );
