/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useMemo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Checkbox from './Checkbox';

import '../assets/styles/elements/_FilterMenu.scss';

export default function ColumnsMenu( {
	id, className, table, items, style } ) {
	const { __ } = useI18n();
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ checked, setChecked ] = useState( Object.keys( items ) );
	const ref = useRef( id );
	// const didMountRef = useRef( false );
	let checkedNow = checked;

	const columnsToggler = useMemo( () => {
		const columns = {};
		const visibleCols = [];
		table?.getAllLeafColumns().map( ( column ) => {
			if ( items[ column.id ] && column.getIsVisible() ) {
				columns[ column.id ] = items[ column.id ];
				visibleCols.push( column.id );
			}
			return false;
		} );

		return { columns, visibleCols };
	}, [ items, table ] );

	useEffect( ( ) => {
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && isActive && ref.current?.id === id ) {
				setActive( false );
				setVisible( false );
			}
		};
		document.addEventListener( 'click', handleClickOutside, false );
	}, [ id, isActive ] );

	const checkedCheckbox = ( target, isChecked ) => {
		if ( isChecked ) {
			const checkedList = [ ...checked, target ];
			checkedNow = [ ... new Set( checkedList ) ];
			setChecked( [ ... new Set( checkedList ) ] );
		}
		if ( ! isChecked ) {
			checkedNow = checked.filter( ( item ) => item !== target );
			setChecked( checked.filter( ( item ) => item !== target ) );
		}
	};

	const handleMenu = () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	};

	return (
		<div className={ `urlslab-FilterMenu urlslab-ColumnsMenu ${ className || '' } ${ isActive ? 'active' : '' }` } style={ style } ref={ ref } id={ id }>
			<div
				className={ `urlslab-ColumnsMenu__title ${ isActive ? 'active' : '' }` }
				onClick={ handleMenu }
				onKeyUp={ ( event ) => handleMenu( event ) }
				role="button"
				tabIndex={ 0 }
			>
				Columns
			</div>
			<div className={ `urlslab-FilterMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
				<div className={ `urlslab-FilterMenu__items--inn ${ items.length > 8 ? 'has-scrollbar' : '' }` }>
					{ table?.getAllLeafColumns().map( ( column ) => {
						return (
							items[ column.id ] && <label><input
								{ ...{
									type: 'checkbox',
									className: 'urlslab-FilterMenu__item',
									key: column.id,
									id: column.id,
									onChange: column.getToggleVisibilityHandler(),
									// checked: column.getIsVisible(),
								} }
							/>
							{ items[ column.id ] }
							</label>
							// </input>
						);
					} ) }

				</div>
			</div>
		</div>
	);
}
