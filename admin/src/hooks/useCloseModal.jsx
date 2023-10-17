import { useCallback, useEffect } from 'react';
import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';
import useTablePanels from './useTablePanels';

export default function useCloseModal( ) {
	const activePanel = useTablePanels( ( state ) => state.activePanel );
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const setOptions = useTablePanels( ( state ) => state.setOptions );

	const handleClose = useCallback( ( operationVal ) => {
		setRowToEdit( {} );
		setOptions( [] );
		activatePanel( undefined );
		document.querySelector( '#urlslab-root' ).classList.remove( 'dark' );
		document.documentElement.classList.remove( 'noscroll' );
		return operationVal;
	}, [ activatePanel, setOptions, setRowToEdit ] );

	useEffect( () => {
		window.addEventListener( 'keyup', ( event ) => {
			if ( event.key === 'Escape' ) {
				handleClose( );
			}
		} );
	}, [ handleClose ] );

	if ( activePanel ) {
		document.querySelector( '#urlslab-root' ).classList.add( 'dark' );
		document.documentElement.classList.add( 'noscroll' );
	}

	return { CloseIcon, handleClose };
}
