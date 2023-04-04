import { useEffect, useState, useRef } from 'react';
import { get, update } from 'idb-keyval';

import Checkbox from './Checkbox';
import { ReactComponent as ColumnsIcon } from '../assets/images/icon-columns.svg';

import '../assets/styles/elements/_FilterMenu.scss';
import '../assets/styles/elements/_ColumnsMenu.scss';

export default function ColumnsMenu( {
	id, className, slug, table, columns, style } ) {
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ hiddenCols, setHiddenCols ] = useState( table?.getState().columnVisibility );
	const ref = useRef( id );

	const tableColumns = table?.getAllLeafColumns();

	useEffect( ( ) => {
		get( slug ).then( async ( dbData ) => {
			if ( dbData?.columnVisibility && Object.keys( dbData?.columnVisibility ).length ) {
				await setHiddenCols( dbData?.columnVisibility );
			}
		} );

		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && isActive && ref.current?.id === id ) {
				setActive( false );
				setVisible( false );
			}
		};
		document.addEventListener( 'click', handleClickOutside, false );
	}, [ id, isActive ] );

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

	const handleMenu = () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	};

	return (
		<div className={ `urlslab-FilterMenu urlslab-ColumnsMenu ${ className || '' } ${ isActive ? 'active' : '' }` } style={ style } ref={ ref } id={ id }>
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
			<div className={ `urlslab-FilterMenu__items urlslab-ColumnsMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
				<div className={ `urlslab-FilterMenu__items--inn ${ columns.length > 8 ? 'has-scrollbar' : '' }` }>
					{ tableColumns?.map( ( column ) => {
						return (
							columns[ column.id ] &&
							<Checkbox
								className="urlslab-FilterMenu__item urlslab-ColumnsMenu__item"
								key={ column.id }
								id={ column.id }
								onChange={ ( isChecked ) => checkedCheckbox( column, isChecked ) }
								checked={ ! Object.keys( hiddenCols ).includes( column.id ) }
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
