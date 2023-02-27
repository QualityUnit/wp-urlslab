/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';

import InputField from './InputField';
import '../assets/styles/elements/_FilterMenu.scss';
import '../assets/styles/elements/_RangeSlider.scss';

export default function MenuInput( {
	className, placeholder, style, onChange, children,
} ) {
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ inputValue, setInputValue ] = useState( );
	const didMountRef = useRef( false );
	const ref = useRef( null );

	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && isActive ) {
				setActive( false );
				setVisible( false );
			}
		};
		if ( onChange && didMountRef.current && ! isActive && inputValue?.length ) {
			onChange( inputValue );
		}
		didMountRef.current = true;
		document.addEventListener( 'click', handleClickOutside, true );
	}, [ isActive ] );

	const handleMenu = () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	};

	return (
		<div className={ `urlslab-FilterMenu ${ className || '' }` } style={ style } ref={ ref }>
			<div
				className={ `urlslab-FilterMenu__title ${ isActive ? 'active' : '' }` }
				onClick={ handleMenu }
				onKeyUp={ ( event ) => handleMenu( event ) }
				role="button"
				tabIndex={ 0 }
			>
				{ children }
			</div>
			<div className={ `urlslab-FilterMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
				<div className="urlslab-FilterMenu__items--inn">
					<div className="label menuInput urlslab-FilterMenu__item">
						<InputField type="search" defaultValue={ inputValue } placeholder={ placeholder } onChange={ ( val ) => setInputValue( val ) } />
					</div>
				</div>
			</div>
		</div>
	);
}
