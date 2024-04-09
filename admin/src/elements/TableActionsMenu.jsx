import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

import Button from '@mui/joy/Button';

import '../assets/styles/elements/_MultiSelectMenu.scss';

export default function TableActionsMenu( { options, className } ) {
	const { noImport, noExport, noDelete } = options;
	const { __ } = useI18n();
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const filters = useTableStore().useFilters();
	const ref = useRef();
	const didMountRef = useRef( false );
	const { activatePanel } = useTablePanels();
	const activefilters = filters ? Object.keys( filters ) : [];

	const handleMenu = useCallback( () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	}, [ isActive, isVisible ] );

	const handleClickOutside = useCallback( ( event ) => {
		if ( ! ref.current?.contains( event.target ) && isActive ) {
			setActive( false );
			setVisible( false );
		}
	}, [ isActive ] );

	useEffect( () => {
		didMountRef.current = true;

		if ( isActive && isVisible ) {
			document.addEventListener( 'click', handleClickOutside, false );
		}
		return () => {
			if ( isActive && isVisible ) {
				document.removeEventListener( 'click', handleClickOutside );
			}
		};
	}, [ handleClickOutside, isActive, isVisible ] );

	return (
		<div className={ `urlslab-MultiSelectMenu urlslab-moreactions-menu fadeInto ${ className || '' }` } ref={ ref }>
			<Button
				variant="text"
				color="neutral"
				onClick={ handleMenu }
				sx={ { ml: 2 } }
				underline
			>{ __( 'More actions', 'urlslab' ) }</Button>
			<div className={ `urlslab-MultiSelectMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
				<div className="urlslab-MultiSelectMenu__items--inn">
					{ ! noImport &&
						<Button variant="plain" color="neutral" size="sm" squareCorners textLeft onClick={ () => activatePanel( 'import' ) }>{ __( 'Import CSV', 'urlslab' ) }</Button>
					}
					{ ! noExport &&
						<Button variant="plain" color="neutral" size="sm" squareCorners textLeft onClick={ () => activatePanel( 'export' ) }>{ __( 'Export CSV', 'urlslab' ) }</Button>
					}
					{ ! noDelete &&
						<Button variant="plain" color="neutral" size="sm" squareCorners textLeft onClick={ () => activatePanel( 'deleteall' ) }>{ __( 'Delete All', 'urlslab' ) }</Button>
					}
					{ ! noDelete && activefilters.length > 0 &&
						<Button variant="plain" color="neutral" size="sm" squareCorners textLeft onClick={ () => activatePanel( 'deleteAllFiltered' ) }>{ __( 'Delete All Filtered', 'urlslab' ) }</Button>
					}
				</div>
			</div>
		</div>
	);
}
