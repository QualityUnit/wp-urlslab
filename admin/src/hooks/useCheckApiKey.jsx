import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { get } from 'idb-keyval';

export default function useCheckApiKey() {
	const queryClient = useQueryClient();
	const settingsLoaded = queryClient.getQueryData( [ 'general' ] );
	const [ apiKeySet, setHasApiKey ] = useState();

	useEffect( () => {
		get( 'apiKeySet' ).then( ( val ) => {
			if ( val === false ) {
				setHasApiKey( false );
			}
		} );
	} );

	return { settingsLoaded, apiKeySet };
}
