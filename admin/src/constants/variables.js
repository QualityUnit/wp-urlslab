export const env = import.meta.env.VITE_ENV;

export const publicDir = () => {
	if(env === 'production') {
		return '/app/plugins/urlslab-plugin/admin/public'
	}
	return '';
}

export const domain = () => {
	if(env === 'production') {
		return ''
	}
	return 'http://liveagent.local';
}
