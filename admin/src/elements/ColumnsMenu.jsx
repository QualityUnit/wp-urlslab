import { memo, useEffect, useState, useRef, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useTableStore from '../hooks/useTableStore';

import Checkbox from './Checkbox';
import Tooltip from './Tooltip';
import SvgIcon from './SvgIcon';

import Button from '@mui/joy/Button';

import '../assets/styles/elements/_MultiSelectMenu.scss';
import '../assets/styles/elements/_ColumnsMenu.scss';

function ColumnsMenu( { className, style, customSlug } ) {
	const { __ } = useI18n();
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );

	const slug = useTableStore( ( state ) => state.activeTable );

	const header = useTableStore( ( state ) => state.tables[ customSlug ? customSlug : slug ]?.header );
	const table = useTableStore( ( state ) => state.tables[ customSlug ? customSlug : slug ]?.table );

	const id = `visibleColumns-${ slug }`;
	const ref = useRef( id );

	const tableColumns = table?.getAllLeafColumns();

	const handleClickOutside = useCallback( ( event ) => {
		if ( ! ref.current?.contains( event.target ) && isActive && ref.current?.id === id ) {
			setActive( false );
			setVisible( false );
		}
	}, [ id, isActive ] );

	useEffect( () => {
		if ( isActive && isVisible ) {
			document.addEventListener( 'click', handleClickOutside, false );
		}
		return () => {
			if ( isActive && isVisible ) {
				document.removeEventListener( 'click', handleClickOutside );
			}
		};
	}, [ handleClickOutside, isActive, isVisible ] );

	const checkedCheckbox = useCallback( ( column, isChecked ) => {
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
	}, [ tableColumns ] );

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
		setActive( false );
		setVisible( false );
	}, [ table ] );

	const handleMenu = useCallback( () => {
		setActive( ( s ) => ! s );

		setTimeout( () => {
			setVisible( ( s ) => ! s );
		}, 100 );
	}, [] );

	return (
		<div className={ `urlslab-MultiSelectMenu urlslab-ColumnsMenu ${ className || '' } ${ isActive ? 'active' : '' }` } style={ style } ref={ ref } id={ id }>
			{ ! isActive &&
			<Tooltip className="showOnHover align-left-0" style={ { width: '11em' } }>{ __( 'Show or hide columns', 'wp-urlslab' ) }</Tooltip>
			}
			<div
				className={ `urlslab-ColumnsMenu__icon ${ isActive ? 'active' : '' }` }
				onClick={ handleMenu }
				onKeyUp={ ( event ) => handleMenu( event ) }
				role="button"
				tabIndex={ 0 }
			>
				<SvgIcon name="columns" />
			</div>
			{ isActive &&
				<div className={ `urlslab-MultiSelectMenu__items urlslab-ColumnsMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
					<div className="flex flex-wrap urlslab-ColumnsMenu__buttons">
						<Button size="sm" variant="plain" color="neutral" onClick={ () => handleVisibilityAll( 'hideAllCols' ) }>{ __( 'Hide all', 'wp-urlslab' ) }</Button>
						<Button size="sm" onClick={ () => handleVisibilityAll( 'showAllCols' ) } sx={ { ml: 'auto' } }>{ __( 'Show all', 'wp-urlslab' ) }</Button>
						<Button size="sm" color="neutral" variant="soft" onClick={ () => handleVisibilityAll( 'resetCols' ) } sx={ { mt: 1, width: '100%' } }>{ __( 'Reset columns visibility', 'wp-urlslab' ) }</Button>
					</div>
					<div className={ `urlslab-MultiSelectMenu__items--inn ${ header && Object.keys( header ).length > 8 ? 'has-scrollbar' : '' }` }>
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
