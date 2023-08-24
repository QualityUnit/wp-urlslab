import { useI18n } from '@wordpress/react-i18n';

export default function useRedirectTableMenus() {
	const { __ } = useI18n();

	const redirectTypes = Object.freeze( {
		301: '301 Moved Permanently',
		302: '302 Found, Moved temporarily',
		303: '303 See Other',
		307: '307 Temporary Redirect',
		308: '308 Permanent Redirect',
	} );

	const matchTypes = Object.freeze( {
		E: 'Exact match',
		S: 'Contains',
		R: 'Regular expression',
	} );

	const logginTypes = Object.freeze( {
		Y: 'Logged in',
		N: 'Not logged in',
		A: 'Any',
	} );

	const notFoundTypes = Object.freeze( {
		Y: 'Page not found',
		N: 'Page found',
		A: 'Any',
	} );

	const header = Object.freeze( {
		match_type: __( 'Match type' ),
		match_url: __( 'URL' ),
		replace_url: __( 'Redirect to' ),
		redirect_code: __( 'HTTP code' ),
		if_not_found: __( 'Page status' ),
		is_logged: __( 'Is logged in' ),
		capabilities: __( 'Capabilities' ),
		ip: __( 'Visitor IP' ),
		roles: __( 'Roles' ),
		browser: __( 'Browser' ),
		cookie: __( 'Cookies' ),
		headers: __( 'Request headers' ),
		params: __( 'Request parameters' ),
		cnt: __( 'Redirects count' ),
		labels: __( 'Tags' ),
	} );

	return { redirectTypes, matchTypes, logginTypes, notFoundTypes, header };
}
