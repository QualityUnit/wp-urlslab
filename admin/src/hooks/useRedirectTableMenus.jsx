import { useMemo } from 'react';
import { __ } from '@wordpress/i18n';

export default function useRedirectTableMenus() {
	// memoized objects to safely use them as dependency in effects
	const redirectTypes = useMemo( () => Object.freeze( {
		301: '301 Moved Permanently',
		302: '302 Found, Moved temporarily',
		303: '303 See Other',
		307: '307 Temporary Redirect',
		308: '308 Permanent Redirect',
	} ), [] );

	const matchTypes = useMemo( () => Object.freeze( {
		E: 'Exact match',
		S: 'Contains',
		R: 'Regular expression',
	} ), [] );

	const logginTypes = useMemo( () => Object.freeze( {
		Y: 'Logged in',
		N: 'Not logged in',
		A: 'Any',
	} ), [] );

	const notFoundTypes = useMemo( () => Object.freeze( {
		Y: 'Page not found',
		N: 'Page found',
		A: 'Any',
	} ), [] );

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

	return { redirectTypes, matchTypes, logginTypes, notFoundTypes, header };
}
