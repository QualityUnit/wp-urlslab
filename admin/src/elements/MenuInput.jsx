import { useEffect, useState, useRef, useCallback } from 'react';

import InputField from './InputField';
import '../assets/styles/elements/_MultiSelectMenu.scss';
import '../assets/styles/elements/_RangeSlider.scss';

export default function MenuInput( {
	className, placeholder, style, onChange, defaultValue, children,
} ) {
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ inputValue, setInputValue ] = useState( defaultValue );
	const didMountRef = useRef( false );
	const ref = useRef( null );

	const handleClickOutside = useCallback( ( event ) => {
		if ( ! ref.current?.contains( event.target ) && isActive ) {
			setActive( false );
			setVisible( false );
		}
	}, [ isActive ] );

	useEffect( () => {
		if ( onChange && didMountRef.current && ! isActive && inputValue !== defaultValue ) {
			onChange( inputValue );
		}
		didMountRef.current = true;

		if ( isActive && isVisible ) {
			document.addEventListener( 'click', handleClickOutside, true );
		}

		return () => {
			if ( isActive && isVisible ) {
				document.removeEventListener( 'click', handleClickOutside );
			}
		};
	}
	// do not add onChange dependency until we're not sure that all passed onChange functions are memoized and reference stable
	// eslint-disable-next-line react-hooks/exhaustive-deps
	, [ defaultValue, handleClickOutside, inputValue, isActive, isVisible ] );

	const handleMenu = useCallback( () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	}, [ isActive, isVisible ] );

	return (
		<div className={ `urlslab-MultiSelectMenu ${ className || '' }` } style={ style } ref={ ref }>
			<div
				className={ `urlslab-MultiSelectMenu__title ${ isActive ? 'active' : '' }` }
				onClick={ handleMenu }
				onKeyUp={ ( event ) => handleMenu( event ) }
				role="button"
				tabIndex={ 0 }
			>
				{ children }
			</div>
			<div className={ `urlslab-MultiSelectMenu__items menuInput ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
				<div className="urlslab-MultiSelectMenu__items--inn">
					<div className="label menuInput urlslab-MultiSelectMenu__item">
						<InputField type="search" defaultValue={ inputValue } placeholder={ placeholder } onChange={ ( val ) => {
							setInputValue( val ); handleClickOutside( val );
						} } />
					</div>
				</div>
			</div>
		</div>
	);
}
