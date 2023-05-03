/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Checkbox from './Checkbox';

import '../assets/styles/elements/_FilterMenu.scss';

export default function FilterMenu( {
	id, className, asTags, style, children, items, checkedItems, isFilter, onChange } ) {
	let checkedNow = checkedItems || [];

	if ( checkedItems && ! checkedItems.isArray() ) {
		checkedNow = checkedItems.split( /[,\|]/ );
	}
	const { __ } = useI18n();
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ checked, setChecked ] = useState( checkedItems );
	const ref = useRef( id || Math.floor( Math.random() * 10000 ) );
	const didMountRef = useRef( false );

	useEffect( ( ) => {
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && isActive && ref.current?.id === id ) {
				setActive( false );
				setVisible( false );
			}
		};
		if ( onChange && didMountRef.current && ! isActive && ( checked?.filter( ( val ) => ! checkedNow?.includes( val ) ) ) ) {
			onChange( checked );
		}
		didMountRef.current = true;
		document.addEventListener( 'click', handleClickOutside, false );
	}, [ id, isActive ] );

	const checkedCheckbox = ( target, isChecked ) => {
		if ( isChecked ) {
			const checkedList = [ ...checked, target ];
			checkedNow = [ ... new Set( checkedList ) ];
			setChecked( [ ... new Set( checkedList ) ] );
		}
		if ( ! isChecked ) {
			checkedNow = checked?.filter( ( item ) => item !== target );
			setChecked( checked?.filter( ( item ) => item !== target ) );
		}
	};

	const handleMenu = () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	};

	return (
		<div className={ `urlslab-FilterMenu ${ className || '' } ${ isActive ? 'active' : '' }` } style={ style } ref={ ref } id={ id }>
			{ children ? <div className="urlslab-inputField-label" dangerouslySetInnerHTML={ { __html: children } } /> : null }
			<div
				className={ `urlslab-FilterMenu__title ${ isFilter ? 'isFilter' : '' } ${ isActive ? 'active' : '' }` }
				onClick={ handleMenu }
				onKeyUp={ ( event ) => handleMenu( event ) }
				role="button"
				tabIndex={ 0 }
			>
				<span>
					{ asTags //if has asTags prop, shows selected items in menu title instead of counter
						? checked?.map( ( itemId ) => `${ items[ itemId ] }, ` )
						: `${ checked?.length } ${ __( 'items selected' ) }`
					}
				</span>
			</div>
			<div className={ `urlslab-FilterMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
				<div className={ `urlslab-FilterMenu__items--inn ${ items.length > 8 ? 'has-scrollbar' : '' }` }>
					{ Object.entries( items ).map( ( [ itemId, value ] ) => {
						return (
							<Checkbox
								className="urlslab-FilterMenu__item"
								key={ itemId }
								id={ itemId }
								onChange={ ( isChecked ) => checkedCheckbox( itemId, isChecked ) }
								checked={ checked?.includes( itemId ) }
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
