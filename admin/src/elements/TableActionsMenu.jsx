import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from './Button';

import '../assets/styles/elements/_MultiSelectMenu.scss';

export default function TableActionsMenu( { options, onAction } ) {
	const { noImport, noExport, noDelete } = options;
	const { __ } = useI18n();
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const ref = useRef();
	const didMountRef = useRef( false );

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
			<Button className="no-padding underline simple ml-m" onClick={ handleMenu }>{ __( 'More actions' ) }</Button>
			<div className={ `urlslab-MultiSelectMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
				<div className="urlslab-MultiSelectMenu__items--inn">
					{ ! noImport &&
					<Button className="simple" onClick={ () => onAction( 'import' ) }>{ __( 'Import CSV' ) }</Button>
					}
					{
						! noExport &&
						<Button className="simple" onClick={ () => onAction( 'export' ) }>{ __( 'Export CSV' ) }</Button>
					}
					{ ! noDelete &&
					<Button className="simple" onClick={ () => onAction( 'deleteall' ) }>{ __( 'Delete All' ) }</Button>
					}
				</div>
			</div>
		</div>
	);
}
