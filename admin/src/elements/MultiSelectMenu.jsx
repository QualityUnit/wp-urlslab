/* eslint-disable no-nested-ternary */
import { useEffect, useState, useRef, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Checkbox from './Checkbox';

import '../assets/styles/elements/_MultiSelectMenu.scss';

export default function MultiSelectMenu( {
	id, className, asTags, style, children, items, description, labels, required, defaultValue, isFilter, onChange, dark, menuStyle, emptyAll } ) {
	const hasSelectAll = items.all;

	const checkedNow = useRef( emptyAll && ! defaultValue.length ? [ 'all' ] : ( defaultValue || [] ) );
	if ( defaultValue && typeof defaultValue === 'string' ) {
		checkedNow.current = defaultValue.split( /[,\|]/ );
	}

	const { __ } = useI18n();
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ checked, setChecked ] = useState( checkedNow.current );
	const ref = useRef( id || Math.floor( Math.random() * 10000 ) );
	const didMountRef = useRef( false );

	const selectAllMenu = useCallback( () => {
		const notAll = ! emptyAll ? { notall: 'Deselect All' } : {};
		const menu = { all: hasSelectAll ? hasSelectAll : 'Select All', ...notAll };
		return menu;
	}, [ emptyAll, hasSelectAll ] );

	const handleClickOutside = useCallback( ( event ) => {
		if ( ! ref.current?.contains( event.target ) && isActive && ref.current?.id === id ) {
			setActive( false );
			setVisible( false );
		}
	}, [ id, isActive ] );

	useEffect( ( ) => {
		if ( onChange && didMountRef.current && ! isActive && ( checked?.filter( ( val ) => ! checkedNow.current?.includes( val ) ) ) ) {
			onChange( checked.filter( ( key ) => key !== 'all' && key !== 'notall' ) );
		}
		didMountRef.current = true;

		if ( isActive && isVisible ) {
			document.addEventListener( 'click', handleClickOutside, false );
		}

		return () => {
			if ( isActive && isVisible ) {
				document.removeEventListener( 'click', handleClickOutside, false );
			}
		};
	}
	// do not add onChange dependency until we're not sure that all passed onChange functions are memoized and reference stable
	// eslint-disable-next-line react-hooks/exhaustive-deps
	, [ checked, handleClickOutside, id, isActive, isVisible ] );

	const checkedCheckbox = useCallback( ( target, isChecked ) => {
		if ( isChecked ) {
			let checkedList;
			if ( target === 'all' || target === 'notall' ) {
				checkedList = target === 'all' ? ( emptyAll ? [ 'all' ] : Object.keys( items ) ) : [];
				checkedNow.current = [ ... new Set( checkedList ) ];
				setChecked( [ ... new Set( checkedList ) ] );
				setActive( false );
				setVisible( false );
				return false;
			}
			checkedList = [ ...checked.filter( ( key ) => key !== 'all' && key !== 'notall' ), target ];
			checkedNow.current = [ ... new Set( checkedList ) ];
			setChecked( [ ... new Set( checkedList ) ] );
		}
		if ( ! isChecked ) {
			checkedNow.current = checked?.filter( ( item ) => item !== target );
			setChecked( checked?.filter( ( item ) => item !== target ) );
		}
	}, [ checked, emptyAll, items ] );

	const handleMenu = useCallback( () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	}, [ isActive, isVisible ] );

	return (
		<>
			<div className={ `urlslab-MultiSelectMenu ${ className || '' } ${ isActive ? 'active' : '' }` } style={ style } ref={ ref } id={ id }>
				{ ! isFilter && children ? <div className={ `urlslab-inputField-label flex flex-align-center mb-xs ${ required ? 'required' : '' }` } ><span dangerouslySetInnerHTML={ { __html: children.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } />{ labels }</div> : null }
				<div
					className={ `urlslab-MultiSelectMenu__title ${ isFilter ? 'isFilter' : '' } ${ isActive ? 'active' : '' } ${ dark ? 'dark' : '' }` }
					onClick={ handleMenu }
					onKeyUp={ ( event ) => handleMenu( event ) }
					role="button"
					tabIndex={ 0 }
				>
					{
						! isFilter
							? <span>
								{ asTags //if has asTags prop, shows selected items in menu title instead of counter
									? checked?.map( ( itemId, index ) => `${ items[ itemId ] }${ index === checked?.length - 1 ? '' : ', ' }` )
									: `${ checked?.length } ${ __( 'items selected' ) }`
								}
							</span>
							: null
					}
					<span dangerouslySetInnerHTML={ { __html: isFilter ? children.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) : items[ checked ] } } />
					{ isFilter && labels }
				</div>
				<div className={ `urlslab-MultiSelectMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' } ${ dark ? 'dark' : '' }` } style={ { ...menuStyle } }>
					<div className={ `urlslab-MultiSelectMenu__items--inn ${ items?.length > 8 ? 'has-scrollbar' : '' }` }>
						{ ! emptyAll && <div className="flex flex-justify-space-between">
							{ Object.entries( selectAllMenu() ).map( ( [ itemId, value ] ) => {
								return <Checkbox
									className={ `urlslab-MultiSelectMenu__item selectAll ${ emptyAll ? 'width-100' : '' }` }
									key={ `${ itemId }-${ isActive }` }
									id={ itemId }
									onChange={ ( isChecked ) => checkedCheckbox( itemId, isChecked ) }
									defaultValue={ checked?.indexOf( itemId ) !== -1 }
								>
									{ value }
								</Checkbox>;
							} ) }
						</div>
						}
						{ Object.entries( items ).map( ( [ itemId, value ] ) => {
							return <Checkbox
								className="urlslab-MultiSelectMenu__item"
								key={ `${ itemId }-${ isActive }` }
								id={ itemId }
								onChange={ ( isChecked ) => checkedCheckbox( itemId, isChecked ) }
								defaultValue={ checked?.indexOf( itemId ) !== -1 }
							>
								{ value }
							</Checkbox>;
						} ) }
					</div>
				</div>
			</div>
			{ description && <p className="urlslab-inputField-description" dangerouslySetInnerHTML={ { __html: description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
		</>
	);
}

