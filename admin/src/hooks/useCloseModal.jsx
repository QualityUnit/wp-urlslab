import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';
import useTablePanels from './useTablePanels';

export default function useCloseModal( ) {
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const setOptions = useTablePanels( ( state ) => state.setOptions );
	const activePanel = useTablePanels( ( state ) => state.activePanel );

	const handleClose = ( operationVal ) => {
		setRowToEdit( {} );
		setOptions( [] );
		activatePanel( undefined );
		document.querySelector( '#urlslab-root' ).classList.remove( 'dark' );
		return operationVal;
	};

	console.log( activePanel );

	window.addEventListener( 'keyup', ( event ) => {
		if ( event.key === 'Escape' ) {
			handleClose( );
		}
	} );
	document.querySelector( '#urlslab-root' ).classList.add( 'dark' );

	return { CloseIcon, handleClose };
}
