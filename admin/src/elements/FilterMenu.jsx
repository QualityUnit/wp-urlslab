import { useEffect, useState, useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Checkbox from './Checkbox';

import '../assets/styles/elements/_FilterMenu.scss';

export default function FilterMenu( {
	className, style, children, items, checkedItems, onChange } ) {
	const { __ } = useI18n();
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ checked, setChecked ] = useState( checkedItems );
	const ref = useRef( null );

	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) ) {
				setActive( false );
				setVisible( false );
			}
		};
		document.addEventListener( 'click', handleClickOutside, true );
	} );

	const checkedCheckbox = ( target, isChecked ) => {
		if ( isChecked ) {
			const checkedList = [ ...checked, target ];
			setChecked( [ ... new Set( checkedList ) ] );
			onChange( checked );
		}
		if ( ! isChecked ) {
			setChecked( checked.filter( ( item ) => item !== target ) );
			onChange( checked );
		}
	};

	const handleMenu = () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	};

	return (
		<div className={ `urlslab-FilterMenu ${ className || '' } ${ isActive ? 'active' : '' }` } style={ style } ref={ ref }>
			{ children ? <div className="urlslab-inputField-label">{ children }</div> : null }
			<div
				className={ `urlslab-FilterMenu__title ${ isActive ? 'active' : '' }` }
				onClick={ handleMenu }
				onKeyUp={ ( event ) => handleMenu( event ) }
				role="button"
				tabIndex={ 0 }
			>
				{ `${ checked.length } ${ __( 'items selected' ) }` }
			</div>
			<div className={ `urlslab-FilterMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
				<div className={ `urlslab-FilterMenu__items--inn ${ items.length > 8 ? 'has-scrollbar' : '' }` }>
					{ Object.entries( items ).map( ( [ id, value ] ) => {
						return (
							<Checkbox
								className="urlslab-FilterMenu__item"
								key={ id }
								id={ id }
								onChange={ ( isChecked ) => checkedCheckbox( id, isChecked ) }
								checked={ checked.includes( id ) }
							>
								{ value }
							</Checkbox>
						);
					} ) }

				</div>
			</div>
		</div>
	);
}
