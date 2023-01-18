export const env = import.meta.env.VITE_ENV;

export const publicDir = () => {
	if(env === 'production') {
		return '/app/plugins/urlslab-plugin/admin/public'
	}
	return '';
}
