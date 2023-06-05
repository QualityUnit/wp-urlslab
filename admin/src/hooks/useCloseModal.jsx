import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';
import useTablePanels from './useTablePanels';

export default function useCloseModal( ) {
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );

	const handleClose = ( operationVal ) => {
		setRowToEdit( {} );
		activatePanel();
		document.querySelector( '#urlslab-root' ).classList.remove( 'dark' );
		return operationVal;
	};

	window.addEventListener( 'keydown', ( event ) => {
		if ( event.key === 'Escape' ) {
			handleClose( );
		}
	} );
	document.querySelector( '#urlslab-root' ).classList.add( 'dark' );

	return { CloseIcon, handleClose };
}
