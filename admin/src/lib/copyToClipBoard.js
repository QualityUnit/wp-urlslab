import { setNotification } from '../hooks/useNotifications';
import { __ } from '@wordpress/i18n';

export default function copyToClipBoard( copyText ) {
	const textArea = document.createElement( 'textarea' );
	textArea.value = copyText;
	document.body.appendChild( textArea );
	textArea.select();

	document.execCommand( 'copy' );
	setNotification( copyText, { message: __( 'Text copied to the clipboard!', 'wp-urlslab' ), status: 'success' } );
	document.body.removeChild( textArea );
}
