import { setNotification } from '../hooks/useNotifications';

export default function copyToClipBoard( copyText ) {
	const textArea = document.createElement( 'textarea' );
	textArea.value = copyText;
	document.body.appendChild( textArea );
	textArea.select();

	document.execCommand( 'copy' );
	setNotification( copyText, { message: 'Text copied to the clipboard!', status: 'success' } );
	document.body.removeChild( textArea );
}
