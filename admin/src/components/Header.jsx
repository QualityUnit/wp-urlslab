import { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';
import { fetchData } from '../api/fetching';
import { fetchSettings } from '../api/settings';
// eslint-disable-next-line import/no-extraneous-dependencies
import NoAPIkey from './NoAPIkey';
import Notifications from './Notifications';
import Button from '../elements/Button';

export default function Header( { pageTitle } ) {
	const [ runCron, setCronRunner ] = useState( false );
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

	const { data: cronResults } = useQuery( {
		queryKey: [ 'cron', 'all' ],
		queryFn: () => fetchData( 'cron/all' ).then( async ( response ) => {
			return await response.json();
		} ).then( ( tasks ) => tasks ),
		enabled: runCron,
		refetchOnWindowFocus: false,
		onSuccess: ( tasks ),
	} );

	return (
		<Suspense>
			<header className="urlslab-header">
				<div className="flex flex-align-center">
					<Logo className="urlslab-header-logo" />
					<span className="urlslab-header-slash">/</span>
					<h1 className="urlslab-header-title">{ pageTitle }</h1>
					<Button active className="small ma-left" onClick={ () => setCronRunner( true ) }>Accelerate Cron Execution</Button>
					{ /* <Notifications /> */ }
				</div>
				{ /* { apikey && apikey.length
					? null
					: <NoAPIkey />
				} */ }
			</header>
		</Suspense>
	);
}
