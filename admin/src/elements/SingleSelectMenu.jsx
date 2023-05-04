/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback, useState, useRef } from 'react';
import Checkbox from './Checkbox';

import '../assets/styles/elements/_MultiSelectMenu.scss';

export default function SortMenu( {
	className, name, style, children, items, checkedId, defaultAccept, autoClose, disabled, isFilter, onChange,
} ) {
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ checked, setChecked ] = useState( checkedId );
	const didMountRef = useRef( false );
	const ref = useRef( name );

	const setDefault = useCallback( () => {
		onChange( checkedId );
	}, [ checkedId ] );

	useEffect( () => {
		if ( defaultAccept ) {
			setDefault();
		}

		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && isActive ) {
				setActive( false );
				setVisible( false );
			}
		};
		if ( onChange && didMountRef.current && ! isActive && ! defaultAccept && checked !== checkedId ) {
			onChange( checked );
		}
		if ( onChange && didMountRef.current && ! isActive && defaultAccept ) { // Accepts change back to default key
			onChange( checked );
		}
		didMountRef.current = true;
		document.addEventListener( 'click', handleClickOutside, true );
	}, [ checked, isActive ] );

	const checkedCheckbox = ( targetId ) => {
		setChecked( targetId );
		if ( autoClose ) {
			setActive( false );
			setVisible( false );
		}
	};

	const handleMenu = () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	};

	return (
		<div className={ `urlslab-MultiSelectMenu urlslab-SortMenu ${ disabled && 'disabled' } ${ className || '' } ${ isActive ? 'active' : '' }` } style={ style } ref={ ref }>
			{ ! isFilter && children ? <div className="urlslab-inputField-label" dangerouslySetInnerHTML={ { __html: children } } /> : null }
			<div
				className={ `urlslab-MultiSelectMenu__title ${ isFilter ? 'isFilter' : '' } ${ isActive ? 'active' : '' }` }
				onClick={ ! disabled && handleMenu }
				onKeyUp={ ( event ) => {
					if ( ! disabled ) {
						handleMenu( event );
					}
				} }
				role="button"
				tabIndex={ 0 }
			>
				<span dangerouslySetInnerHTML={ { __html: isFilter ? children : items[ checked ] } } />
			</div>
			<div className={ `urlslab-MultiSelectMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
				<div className={ `urlslab-MultiSelectMenu__items--inn ${ Object.values( items ).length > 8 ? 'has-scrollbar' : '' }` }>
					{ Object.entries( items ).map( ( [ id, value ] ) => {
						return (
							<Checkbox
								className="urlslab-MultiSelectMenu__item"
								key={ id }
								id={ id }
								onChange={ () => checkedCheckbox( id ) }
								name={ name }
								checked={ id === checked }
								radial
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
