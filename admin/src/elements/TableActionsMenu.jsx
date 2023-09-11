import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

import Button from '@mui/joy/Button';

import '../assets/styles/elements/_MultiSelectMenu.scss';

export default function TableActionsMenu( { options } ) {
	const { noImport, noExport, noDelete } = options;
	const { __ } = useI18n();
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const filters = useTableStore( ( state ) => state.filters );
	const ref = useRef();
	const didMountRef = useRef( false );
	const { activatePanel } = useTablePanels();
	const activefilters = filters ? Object.keys( filters ) : null;

	const handleMenu = () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	};

	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && isActive ) {
				setActive( false );
				setVisible( false );
			}
		};
		didMountRef.current = true;
		document.addEventListener( 'click', handleClickOutside, false );
	}, [ isActive ] );

	return (
		<div className="urlslab-MultiSelectMenu urlslab-moreactions-menu fadeInto" ref={ ref }>
			<Button
				variant="text"
				onClick={ handleMenu }
				sx={ { ml: 2 } }
				underline
			>{ __( 'More actions' ) }</Button>
			<div className={ `urlslab-MultiSelectMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
				<div className="urlslab-MultiSelectMenu__items--inn">
					{ ! noImport &&
						<Button variant="plain" color="neutral" size="sm" squareCorners textLeft onClick={ () => activatePanel( 'import' ) }>{ __( 'Import CSV' ) }</Button>
					}
					{ ! noExport &&
						<Button variant="plain" color="neutral" size="sm" squareCorners textLeft onClick={ () => activatePanel( 'export' ) }>{ __( 'Export CSV' ) }</Button>
					}
					{ ! noDelete &&
						<Button variant="plain" color="neutral" size="sm" squareCorners textLeft onClick={ () => activatePanel( 'deleteall' ) }>{ __( 'Delete All' ) }</Button>
					}
					{ ! noDelete && activefilters.length > 0 &&
						<Button variant="plain" color="neutral" size="sm" squareCorners textLeft onClick={ () => activatePanel( 'deleteAllFiltered' ) }>{ __( 'Delete All Filtered' ) }</Button>
					}
				</div>
			</div>
		</div>
	);
}
