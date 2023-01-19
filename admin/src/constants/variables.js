<<<<<<< HEAD
export const env = import.meta.env.VITE_ENV;

export const publicDir = () => {
	if(env === 'production') {
=======
export const production = import.meta.env.PROD;

export const publicDir = () => {
	if ( production ) {
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
		return '/app/plugins/urlslab-plugin/admin/public'
	}
	return '';
}
<<<<<<< HEAD
=======

export const domain = () => {
	if ( production ) {
		return ''
	}
	return 'http://liveagent.local';
}
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
