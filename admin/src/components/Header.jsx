import { Suspense } from 'react';
import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';
import { fetchSettings } from '../api/settings';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery } from '@tanstack/react-query';
import NoAPIkey from './NoAPIkey';
import Notifications from './Notifications';

export default function Header( { pageTitle } ) {
	// let apikey = '********';
	// const generalSettings = useQuery( {
	// 	queryKey: [ 'general' ],
	// 	queryFn: () => fetchSettings( 'general' ).then( ( data ) => {
	// 		return data;
	// 	} ),
	// } );

	// if ( generalSettings.isSuccess ) {
	// 	const settings = generalSettings.data[ 0 ].options[ 'urlslab-api-key' ];
	// 	apikey = settings.value;
	// }

	return (
		<Suspense>
			<header className="urlslab-header">
				<div className="flex flex-align-center">
					<Logo className="urlslab-header-logo" />
					<span className="urlslab-header-slash">/</span>
					<h1 className="urlslab-header-title">{ pageTitle }</h1>
					<Notifications />
				</div>
				{ /* { apikey && apikey.length
					? null
					: <NoAPIkey />
				} */ }
			</header>
		</Suspense>
	);
}
