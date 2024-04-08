import { __ } from '@wordpress/i18n';

export const header = Object.freeze( {
	match_type: __( 'Match type', 'wp-urlslab' ),
	match_url: __( 'URL', 'wp-urlslab' ),
	replace_url: __( 'Redirect to', 'wp-urlslab' ),
	redirect_code: __( 'HTTP code', 'wp-urlslab' ),
	if_not_found: __( 'Page status', 'wp-urlslab' ),
	is_logged: __( 'Is logged in', 'wp-urlslab' ),
	ip: __( 'Visitor IP', 'wp-urlslab' ),
	roles: __( 'Roles', 'wp-urlslab' ),
	capabilities: __( 'Capabilities', 'wp-urlslab' ),
	browser: __( 'Browser', 'wp-urlslab' ),
	cookie: __( 'Cookies', 'wp-urlslab' ),
	headers: __( 'Request headers', 'wp-urlslab' ),
	params: __( 'Request parameters', 'wp-urlslab' ),
	cnt: __( 'Redirects count', 'wp-urlslab' ),
	labels: __( 'Tags', 'wp-urlslab' ),
	created: __( 'Created', 'wp-urlslab' ),
} );
