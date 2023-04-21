import { useI18n } from '@wordpress/react-i18n';

import useCheckApiKey from '../hooks/useCheckApiKey';
import Button from '../elements/Button';

import '../assets/styles/components/_NoAPIkey.scss';

export default function NoAPIkey() {
	const { __ } = useI18n();
	const { settingsLoaded, apiKeySet } = useCheckApiKey();

	return (
		settingsLoaded && apiKeySet === false &&
		<div className="urslab-no-apikey">
			<h3>{ __( 'No API Key added' ) }</h3>
			<p>{ __( 'You can only retrieve data for a homepage of any domain without an API key. Input an API key to unlock all URLs.' ) }</p>
			<Button href="https://www.urlslab.com" target="_blank" active>{ __( 'Get API key' ) }</Button>
		</div>
	);
}
