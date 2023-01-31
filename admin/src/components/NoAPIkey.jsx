import { useI18n } from '@wordpress/react-i18n';
import Button from '../elements/Button';

import '../assets/styles/components/_NoAPIkey.scss';

export default function NoAPIkey() {
	const { __ } = useI18n();

	return (
		<div className="urslab-no-apikey">
			<h3>{ __( 'No API Key added' ) }</h3>
			<p>{ __( 'You can only retrieve data for a homepage of any domain without an API key. Input an API key to unlock all URLs.' ) }</p>
			<Button href="https://www.urlslab.com" target="_blank" active>Get API key</Button>
		</div>
	);
}
