import { Suspense } from 'react';
import { publicDir } from '../constants/variables';
import { fetchSettings } from '../api/settings';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery } from '@tanstack/react-query';
import NoAPIkey from './NoAPIkey';

export default function Header( { pageTitle } ) {
	let apikey = null;
	const generalSettings = useQuery( {
		queryKey: [ 'general' ],
		queryFn: () => fetchSettings( 'general' ).then( ( data ) => {
			return data;
		} ),
	} );

	if ( generalSettings.isSuccess ) {
		const settings = generalSettings.data[ 0 ].options[ 0 ];
		if ( settings.id === 'urlslab-api-key' ) {
			apikey = settings.value;
		}
	}

	return (
		<Suspense>
			<header className="urlslab-header">
				<div className="flex flex-align-center">
					<img className="urlslab-header-logo" src={ `${ publicDir() }/images/urlslab-logo.svg` } alt="URLslab logo" />
					<span className="urlslab-header-slash">/</span>
					<h1 className="urlslab-header-title">{ pageTitle }</h1>
				</div>
				{
					( apikey && apikey.length ) || <NoAPIkey />
				}
			</header>
		</Suspense>
	);
}
