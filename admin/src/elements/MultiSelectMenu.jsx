/* eslint-disable no-nested-ternary */
import { useEffect, useState, useRef, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Checkbox from './Checkbox';

import '../assets/styles/elements/_MultiSelectMenu.scss';

// if emptyAll, consider also [ '' ] as [] - fix for modules selection in Tags table where api returns [''] for "All modules" option
const isEmptyAll = ( emptyAll, data ) => emptyAll && ( ! data.length || ( data.length === 1 && data[ 0 ] === '' ) );
// simple equality check of new and previous values
const isEqual = ( newVal, prevVal ) => {
	if ( newVal.length !== prevVal.length ) {
		return false;
	}
	for ( const [ index, elm ] of newVal.entries() ) {
		if ( elm !== prevVal[ index ] ) {
			return false;
		}
	}
	return true;
};

export default function MultiSelectMenu( {
	id, className, asTags, style, children, items, description, labels, required, defaultValue, value, isFilter, onChange, dark, menuStyle, emptyAll, liveUpdate } ) {
	const hasSelectAll = items.all;
	const isControlledInit = useRef( true );
	const isControlled = value !== undefined;
	const initialValue = useRef( isControlled ? value : defaultValue );

	const checkedNow = useRef( isEmptyAll( emptyAll, initialValue.current ) ? [ 'all' ] : ( initialValue.current || [] ) );
	if ( initialValue.current && typeof initialValue.current === 'string' ) {
		checkedNow.current = initialValue.current.split( /[,\|]/ );
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
		if ( ! liveUpdate && onChange && didMountRef.current && ! isActive && ( checked?.filter( ( val ) => ! checkedNow.current?.includes( val ) ) ) ) {
			const newVal = checked.filter( ( key ) => key !== 'all' && key !== 'notall' );
			if ( ! isEqual( newVal, isControlled ? value : defaultValue || [] ) ) {
				onChange( newVal );
			}
		}
	}
	// do not add onChange dependency until we're not sure that all passed onChange functions are memoized and reference stable
	// do not run on 'value' change
	// eslint-disable-next-line react-hooks/exhaustive-deps
	, [ checked, defaultValue, isActive, isControlled, liveUpdate ] );

	useEffect( ( ) => {
		didMountRef.current = true;

		if ( isActive && isVisible ) {
			document.addEventListener( 'click', handleClickOutside, false );
		}

		return () => {
			if ( isActive && isVisible ) {
				document.removeEventListener( 'click', handleClickOutside, false );
			}
		};
	}, [ handleClickOutside, isActive, isVisible ] );

	const checkedCheckbox = useCallback( ( target, isChecked ) => {
		if ( isChecked ) {
			let checkedList;
			if ( target === 'all' || target === 'notall' ) {
				checkedList = target === 'all' ? ( emptyAll ? [ 'all' ] : Object.keys( items ) ) : [];
				checkedNow.current = [ ... new Set( checkedList ) ];
				if ( liveUpdate && onChange ) {
					onChange( checkedNow.current );
				}
				setChecked( checkedNow.current );
				setActive( false );
				setVisible( false );
				return false;
			}
			checkedList = [ ...checked.filter( ( key ) => key !== 'all' && key !== 'notall' ), target ];
			checkedNow.current = [ ... new Set( checkedList ) ];
			if ( liveUpdate && onChange ) {
				onChange( checkedNow.current );
			}
			setChecked( checkedNow.current );
		}
		if ( ! isChecked ) {
			checkedNow.current = checked?.filter( ( item ) => item !== target );
			if ( liveUpdate && onChange ) {
				onChange( checkedNow.current );
			}
			setChecked( checkedNow.current );
		}
	}
	// do not add onChange dependency until we're not sure that all passed onChange functions are memoized and reference stable
	// eslint-disable-next-line react-hooks/exhaustive-deps
	, [ checked, emptyAll, items, liveUpdate ] );

	const handleMenu = useCallback( () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	}, [ isActive, isVisible ] );

	useEffect( () => {
		// update value from parent and prevent double render on input mount
		if ( isControlled && ! isControlledInit.current ) {
			const newVal = isEmptyAll( emptyAll, value ) ? [ 'all' ] : value;
			if ( ! isEqual( newVal, checked ) ) {
				setChecked( newVal );
			}
		}
		isControlledInit.current = false;
	}
	// do not run on 'checked' change
	// eslint-disable-next-line react-hooks/exhaustive-deps
	, [ emptyAll, isControlled, value ] );

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
							{ Object.entries( selectAllMenu() ).map( ( [ itemId, val ] ) => {
								return <Checkbox
									className={ `urlslab-MultiSelectMenu__item selectAll ${ emptyAll ? 'width-100' : '' }` }
									key={ `${ itemId }-${ isActive }` }
									id={ itemId }
									onChange={ ( isChecked ) => checkedCheckbox( itemId, isChecked ) }
									defaultValue={ checked?.indexOf( itemId ) !== -1 }
								>
									{ val }
								</Checkbox>;
							} ) }
						</div>
						}
						{ Object.entries( items ).map( ( [ itemId, val ] ) => {
							return <Checkbox
								className="urlslab-MultiSelectMenu__item"
								key={ `${ itemId }-${ isActive }` }
								id={ itemId }
								onChange={ ( isChecked ) => checkedCheckbox( itemId, isChecked ) }
								defaultValue={ checked?.indexOf( itemId ) !== -1 }
							>
								{ val }
							</Checkbox>;
						} ) }
					</div>
				</div>
			</div>
			{ description && <p className="urlslab-inputField-description" dangerouslySetInnerHTML={ { __html: description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
		</>
	);
}

