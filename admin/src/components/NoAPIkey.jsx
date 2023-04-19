import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { get } from 'idb-keyval';
import Button from '../elements/Button';

import '../assets/styles/components/_NoAPIkey.scss';

export default function NoAPIkey() {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const data = queryClient.getQueryData( [ 'general' ] );
	const [ hasApiKey, setHasApiKey ] = useState();

	useEffect( () => {
		get( 'apiKeySet' ).then( ( val ) => {
			if ( val === false ) {
				setHasApiKey( false );
			}
		} );
	} );
	return (
		data && hasApiKey === false &&
		<div className="urslab-no-apikey">
			<h3>{ __( 'No API Key added' ) }</h3>
			<p>{ __( 'You can only retrieve data for a homepage of any domain without an API key. Input an API key to unlock all URLs.' ) }</p>
			<Button href="https://www.urlslab.com" target="_blank" active>Get API key</Button>
		</div>
	);
}
