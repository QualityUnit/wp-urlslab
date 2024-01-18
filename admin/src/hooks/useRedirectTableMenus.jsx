import { useMemo } from 'react';
import { __ } from '@wordpress/i18n';

export default function useRedirectTableMenus() {
	// memoized objects to safely use them as dependency in effects

	const header = useMemo( () => Object.freeze( {
		match_type: __( 'Match type' ),
		match_url: __( 'URL' ),
		replace_url: __( 'Redirect to' ),
		redirect_code: __( 'HTTP code' ),
		if_not_found: __( 'Page status' ),
		is_logged: __( 'Is logged in' ),
		ip: __( 'Visitor IP' ),
		roles: __( 'Roles' ),
		capabilities: __( 'Capabilities' ),
		browser: __( 'Browser' ),
		cookie: __( 'Cookies' ),
		headers: __( 'Request headers' ),
		params: __( 'Request parameters' ),
		cnt: __( 'Redirects count' ),
		labels: __( 'Tags' ),
		created: __( 'Created' ),
	} ), [] );

	return { header };
}
