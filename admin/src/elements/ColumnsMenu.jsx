import { memo, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { update } from 'idb-keyval';

import Checkbox from './Checkbox';
import Tooltip from './Tooltip';

import Button from '@mui/joy/Button';

import { ReactComponent as ColumnsIcon } from '../assets/images/icons/icon-columns.svg';

import '../assets/styles/elements/_MultiSelectMenu.scss';
import '../assets/styles/elements/_ColumnsMenu.scss';
import useTableStore from '../hooks/useTableStore';

function ColumnsMenu( { className, style, customHeader, customSlug } ) {
	const { __ } = useI18n();
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const id = 'visibleColumns';
	const ref = useRef( id );

	let { header, slug } = useTableStore();
	const table = useTableStore( ( state ) => state.table );

	if ( customHeader ) {
		header = customHeader;
	}

	if ( customSlug ) {
		slug = customSlug;
	}

	const tableColumns = useMemo( () => {
		return table?.getAllLeafColumns();
	}, [ table ] );

	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && isActive && ref.current?.id === id ) {
				setActive( false );
				setVisible( false );
			}
		};
		document.addEventListener( 'click', handleClickOutside, false );
	}, [ id, isActive ] );

	const checkedCheckbox = ( column, isChecked ) => {
		// make sure the action columns are visible if at least one column is turned on
		if ( isChecked ) {
			const requiredColumns = [ 'check', 'editRow' ];
			for ( const c in tableColumns ) {
				const col = tableColumns[ c ];
				if ( requiredColumns.includes( col.id ) && ! col.getIsVisible() ) {
					col.toggleVisibility();
				}
			}
		}

		column.toggleVisibility();
		update( slug, ( dbData ) => {
			return { ...dbData, columnVisibility: table?.getState().columnVisibility };
		} );
	};

	const handleVisibilityAll = useCallback( ( action ) => {
		if ( action === 'showAllCols' ) {
			table.toggleAllColumnsVisible( true );
		}
		if ( action === 'hideAllCols' ) {
			table.toggleAllColumnsVisible( false );
		}
		if ( action === 'resetCols' ) {
			table.resetColumnVisibility();
		}
		setActive( ! isActive );
		update( slug, ( dbData ) => {
			return { ...dbData, columnVisibility: table?.getState().columnVisibility };
		} );
	}, [ isActive, slug, table ] );

	const handleMenu = () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	};

	return (
		<div className={ `urlslab-MultiSelectMenu urlslab-ColumnsMenu ${ className || '' } ${ isActive ? 'active' : '' }` } style={ style } ref={ ref } id={ id }>
			{ ! isActive &&
			<Tooltip className="showOnHover align-left-0" style={ { width: '11em' } }>{ __( 'Show or hide columns' ) }</Tooltip>
			}
			<div
				className={ `urlslab-ColumnsMenu__icon ${ isActive ? 'active' : '' }` }
				onClick={ handleMenu }
				onKeyUp={ ( event ) => handleMenu( event ) }
				role="button"
				tabIndex={ 0 }
			>
				<ColumnsIcon />
			</div>
			{ isActive &&
				<div className={ `urlslab-MultiSelectMenu__items urlslab-ColumnsMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
					<div className="flex flex-wrap urlslab-ColumnsMenu__buttons">
						<Button size="sm" variant="plain" color="neutral" onClick={ () => handleVisibilityAll( 'hideAllCols' ) }>{ __( 'Hide all' ) }</Button>
						<Button size="sm" onClick={ () => handleVisibilityAll( 'showAllCols' ) } sx={ { ml: 'auto' } }>{ __( 'Show all' ) }</Button>
						<Button size="sm" color="neutral" variant="soft" onClick={ () => handleVisibilityAll( 'resetCols' ) } sx={ { mt: 1 } }>{ __( 'Reset columns visibility' ) }</Button>
					</div>
					<div className={ `urlslab-MultiSelectMenu__items--inn ${ header.length > 8 ? 'has-scrollbar' : '' }` }>
						{ tableColumns?.map( ( column ) => {
							return (
								header[ column.id ] &&
								<Checkbox
									className="urlslab-MultiSelectMenu__item urlslab-ColumnsMenu__item"
									key={ column.id }
									id={ column.id }
									onChange={ ( isChecked ) => checkedCheckbox( column, isChecked ) }
									defaultValue={ column.getIsVisible() }
								>
									{ header[ column.id ] }
								</Checkbox>
							);
						} ) }
					</div>
				</div>
			}
		</div>
	);
}

export default memo( ColumnsMenu );
