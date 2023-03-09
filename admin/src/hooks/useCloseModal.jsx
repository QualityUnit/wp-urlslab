import { useEffect } from 'react';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';

export default function useCloseModal( handlePanel ) {
	const handleClose = ( operationVal ) => {
		document.querySelector( '#urlslab-root' ).classList.remove( 'dark' );
		return operationVal;
	};

	useEffect( () => {
		window.addEventListener( 'keydown', ( event ) => {
			if ( event.key === 'Escape' ) {
				handleClose( handlePanel() );
			}
		}
		);
		document.querySelector( '#urlslab-root' ).classList.add( 'dark' );
	} );

	return { CloseIcon, handleClose };
}
