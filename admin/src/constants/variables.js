export const production = import.meta.env.PROD;

export const publicDir = () => {
	if ( production ) {
		return '/app/plugins/urlslab-plugin/admin/public'
	}
	return '';
}

export const domain = () => {
	if ( production ) {
		return ''
	}
	return 'http://liveagent.local';
}
