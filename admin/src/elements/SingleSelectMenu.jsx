/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState, useRef, useCallback } from 'react';

import '../assets/styles/elements/_MultiSelectMenu.scss';
import { checkItemReturnType } from '../lib/helpers';

export default function SingleSelectMenu( {
	className, name, style, children, items, description, labels, defaultValue, required, defaultAccept, autoClose, disabled, isFilter, onChange, dark,
} ) {
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ checked, setChecked ] = useState( checkItemReturnType( defaultValue, items || {} ) );
	const didMountRef = useRef( false );
	const ref = useRef( name );

	const handleClickOutside = useCallback( ( event ) => {
		if ( ! ref.current?.contains( event.target ) && isActive ) {
			setActive( false );
			setVisible( false );
		}
	}, [ isActive ] );

	useEffect( () => {
		if ( onChange && didMountRef.current && ! isActive && ! defaultAccept && checked !== defaultValue ) {
			onChange( checked );
		}
		if ( onChange && didMountRef.current && ! isActive && defaultAccept ) { // Accepts change back to default key
			onChange( checked );
		}
		didMountRef.current = true;

		if ( isActive && isVisible ) {
			document.addEventListener( 'click', handleClickOutside, true );
		}

		return () => {
			if ( isActive && isVisible ) {
				document.removeEventListener( 'click', handleClickOutside, true );
			}
		};
	}
	// do not add onChange dependency until we're not sure that all passed onChange functions are memoized and reference stable
	// eslint-disable-next-line react-hooks/exhaustive-deps
	, [ checked, defaultAccept, defaultValue, handleClickOutside, isActive, isVisible ] );

	const checkedCheckbox = useCallback( ( targetId ) => {
		setChecked( targetId );
		if ( autoClose ) {
			setActive( false );
			setVisible( false );
		}
	}, [ autoClose ] );

	const handleMenu = useCallback( () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	}, [ isActive, isVisible ] );

	if ( ! items ) {
		return null;
	}

	return (
		<>
			<div className={ `urlslab-MultiSelectMenu urlslab-SortMenu is-single-select ${ disabled && 'disabled' } ${ className || '' } ${ isActive ? 'active' : '' }` } style={ style } ref={ ref }>
				{ ! isFilter && children ? <div className={ `urlslab-inputField-label flex flex-align-center mb-xs ${ required ? 'required' : '' }` }><span dangerouslySetInnerHTML={ { __html: children.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } />{ labels }</div> : null }
				<div
					className={ `urlslab-MultiSelectMenu__title ${ isFilter ? 'isFilter' : '' } ${ isActive ? 'active' : '' } ${ dark ? 'dark' : '' }` }
					onClick={ ! disabled && handleMenu }
					onKeyUp={ ( event ) => {
						if ( ! disabled ) {
							handleMenu( event );
						}
					} }
					role="button"
					tabIndex={ 0 }
				>
					<span dangerouslySetInnerHTML={ { __html: isFilter ? children.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) : items[ checked ] } } />
					{ isFilter && labels }
				</div>
				<div className={ `urlslab-MultiSelectMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' } ${ dark ? 'dark' : '' }` }>
					<ul className={ `urlslab-MultiSelectMenu__items--inn ${ Object.values( items ).length > 8 ? 'has-scrollbar' : '' }` }>
						{ Object.entries( items ).map( ( [ id, value ] ) => {
							// check type of option key to return wanted type and pass type check with 'checked' value
							const optionKey = id === '' || isNaN( id ) ? id : +id;
							return (
								<li
									key={ optionKey }
									className={ `urlslab-MultiSelectMenu__item ${ dark ? 'dark' : '' } ${ optionKey === checked ? 'active' : '' }` }
									onClick={ optionKey !== checked ? () => checkedCheckbox( optionKey ) : null }
								>
									{ value }
								</li>
							);
						} ) }
					</ul>
				</div>
			</div>
			{ description && <p className="urlslab-inputField-description" dangerouslySetInnerHTML={ { __html: description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
		</>
	);
}
