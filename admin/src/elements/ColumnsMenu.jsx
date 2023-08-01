import { memo, useEffect, useState, useRef, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { get, update } from 'idb-keyval';

import Checkbox from './Checkbox';
import Button from './Button';
import Tooltip from './Tooltip';

import { ReactComponent as ColumnsIcon } from '../assets/images/icons/icon-columns.svg';

import '../assets/styles/elements/_MultiSelectMenu.scss';
import '../assets/styles/elements/_ColumnsMenu.scss';

function ColumnsMenu( { id, className, slug, table, columns, style } ) {
	const { __ } = useI18n();
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ hiddenCols, setHiddenCols ] = useState( table?.getState().columnVisibility );
	const ref = useRef( id );

	const tableColumns = table?.getAllLeafColumns();

	const getColumnState = useCallback( () => {
		get( slug ).then( async ( dbData ) => {
			if ( dbData?.columnVisibility && Object.keys( dbData?.columnVisibility ).length ) {
				await setHiddenCols( dbData?.columnVisibility );
			}
		} );
	}, [ slug ] );

	useEffect( ( ) => {
		getColumnState();
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && isActive && ref.current?.id === id ) {
				setActive( false );
				setVisible( false );
			}
		};
		document.addEventListener( 'click', handleClickOutside, false );
	}, [ getColumnState, id, isActive ] );

	const checkedCheckbox = ( column, isChecked ) => {
		const hiddenColsCopy = { ...hiddenCols };
		column.toggleVisibility();
		if ( isChecked ) {
			delete hiddenColsCopy[ `${ column.id }` ];
			setHiddenCols( hiddenColsCopy );
		}
		if ( ! isChecked ) {
			hiddenColsCopy[ column.id ] = false;
			setHiddenCols( hiddenColsCopy );
		}
		update( slug, ( dbData ) => {
			return { ...dbData, columnVisibility: hiddenColsCopy };
		} );
	};

	const handleVisibilityAll = useCallback( ( action ) => {
		const columnsArray = table.getAllColumns();
		const hiddenColsCopy = { ...hiddenCols };

		columnsArray.forEach( ( column ) => {
			if ( action === 'showAllCols' && ! column.getIsVisible() ) {
				column.toggleVisibility();
				delete hiddenColsCopy[ `${ column.id }` ];
				setHiddenCols( hiddenColsCopy );
			}
			if ( action === 'hideAllCols' && column.getIsVisible() ) {
				column.toggleVisibility();
				hiddenColsCopy[ column.id ] = false;
				setHiddenCols( hiddenColsCopy );
			}
		} );

		update( slug, ( dbData ) => {
			return { ...dbData, columnVisibility: hiddenColsCopy };
		} );
	}, [ hiddenCols, slug, table ] );

	const handleMenu = () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	};

	return (
		<div className={ `urlslab-MultiSelectMenu urlslab-ColumnsMenu ${ className || '' } ${ isActive ? 'active' : '' }` } style={ style } ref={ ref } id={ id }>
			{ ! isActive &&
			<Tooltip className="showOnHover align-left-0" style={ { width: '11em' } }>{ __( 'Turn off/on columns' ) }</Tooltip>
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
				<div className="flex urlslab-ColumnsMenu__buttons"><Button className="simple" onClick={ () => handleVisibilityAll( 'hideAllCols' ) }>{ __( 'Hide all' ) }</Button><Button className="ma-left active" onClick={ () => handleVisibilityAll( 'showAllCols' ) }>{ __( 'Show all' ) }</Button></div>
				<div className={ `urlslab-MultiSelectMenu__items--inn ${ columns.length > 8 ? 'has-scrollbar' : '' }` }>
					{ tableColumns?.map( ( column ) => {
						return (
							columns[ column.id ] &&
							<Checkbox
								className="urlslab-MultiSelectMenu__item urlslab-ColumnsMenu__item"
								key={ column.id }
								id={ column.id }
								onChange={ ( isChecked ) => checkedCheckbox( column, isChecked ) }
								defaultValue={ ! Object.keys( hiddenCols ).includes( column.id ) }
							>
								{ columns[ column.id ] }
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
