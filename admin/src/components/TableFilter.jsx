import { useRef, useCallback, useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useFilter } from '../hooks/filteringSorting';

import Button from '../elements/Button';
import SortMenu from '../elements/SortMenu';
import InputField from '../elements/InputField';
import RangeInputs from '../elements/RangeInputs';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';

import '../assets/styles/components/_TableFilter.scss';

export default function TableFilter( { slug, header, initialRow, onFilter } ) {
	const { __ } = useI18n();
	const { filters, currentFilters, addFilter, removeFilters } = useFilter( { slug } );
	const ref = useRef( null );
	const [ filtering ] = useState( { usedFilters: [], possibleFilters: { ...header } } );
	const [ filterKey, setFilterKey ] = useState();
	const [ filterOperator, setFilterOperator ] = useState();
	const [ filterVal, setFilterVal ] = useState();
	const [ isNumber, setIsNumber ] = useState( false );
	const [ panelActive, activatePanel ] = useState( false );
	const activeFilters = currentFilters ? Object.keys( currentFilters ) : null;
	const runFilter = useRef( false );

	const numericOp = {
		'': 'is exactly',
		'<>': 'is not equal',
		IN: 'is one of',
		BETWEEN: 'is between',
		'>': 'is larger than',
		'<': 'is smaller than',
	};

	const stringOp = {
		LIKE: 'contains',
		'LIKE%': 'begins with',
		'%LIKE': 'ends with',
		'': 'is exactly',
		'<>': 'is not',
		IN: 'is one of',
		'>': 'is longer than',
		'<': 'is shorter than',
	};

	const handleType = useCallback( ( key ) => {
		setIsNumber( false );
		if ( typeof initialRow[ key ] === 'number' ) {
			setIsNumber( true );
		}
	}, [ initialRow ] );

	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && panelActive ) {
				activatePanel( false );
			}
		};

		document.addEventListener( 'click', handleClickOutside, false );
	}, [ filtering, isNumber, panelActive ] );

	if ( onFilter && runFilter.current ) {
		runFilter.current = false;
		onFilter( { filters, currentFilters } );
	}

	const handleSaveFilter = () => {
		let key = filterKey;
		const op = filterOperator;
		const val = filterVal;

		if ( ! key ) {
			key = Object.keys( filtering?.possibleFilters )[ 0 ];
		}

		filtering?.usedFilters.push( key );
		delete filtering?.possibleFilters[ key ];
		activatePanel( false );

		if ( ! op ) {
			addFilter( key, val );
		}

		if ( op && op !== 'IN' && op !== 'BETWEEN' ) {
			addFilter( key, encodeURIComponent( `{"op":"${ op }","val":"${ val }"}` ) );
		}

		if ( op === 'IN' ) {
			addFilter( key, encodeURIComponent( `{"op":"${ op }","val":[${ val }]}` ) );
		}

		if ( op === 'BETWEEN' ) {
			addFilter( key, encodeURIComponent( `{"op":"${ op }","min":${ val.min }, "max": ${ val.max }}` ) );
		}

		runFilter.current = true;
	};

	const handleEditFilter = () => {
		activatePanel( true );
	};

	const handleRemoveFilter = ( keysArray ) => {
		if ( keysArray?.length === 1 ) {
			const key = keysArray[ 0 ];
			const val = header[ key ];
			filtering.usedFilters = filtering?.usedFilters.filter( ( k ) => k !== key );
			filtering.possibleFilters = { [ key ]: `${ val }`, ...filtering?.possibleFilters };
		}
		if ( keysArray?.length > 1 ) {
			filtering.usedFilters = [];
			filtering.possibleFilters = { ...header };
		}
		removeFilters( keysArray );

		runFilter.current = true;
	};

	return (
		<div className="flex flex-align-center flex-wrap">
			{ header && activeFilters?.map( ( key ) => {
				return ( <Button
					key={ key }
					className="outline ml-s"
					onClick={ handleEditFilter }>
					{ header[ key ] }
					<CloseIcon className="close" onClick={ () => handleRemoveFilter( [ key ] ) } />
				</Button> );
			} ) }

			<div ref={ ref } className="pos-relative">
				<Button className="simple underline" onClick={ () => activatePanel( ! panelActive ) }>{ __( '+ Add filter' ) }
				</Button>

				{ panelActive &&
					<div className="urlslab-panel urslab-TableFilter-panel pos-absolute">
						<div className="flex flex-align-center">
							<SortMenu
								className="mr-s"
								items={ filtering?.possibleFilters }
								name="filters"
								checkedId={ Object.keys( filtering?.possibleFilters )[ 0 ] }
								onChange={ ( key ) => {
									handleType( key ); setFilterKey( key );
								} }
							/>
							<SortMenu
								className="ml-s"
								items={ isNumber ? numericOp : stringOp }
								name="filters"
								checkedId={ Object.keys( isNumber ? numericOp : stringOp )[ 0 ] }
								onChange={ ( op ) => setFilterOperator( op ) }
							/>
						</div>
						{ filterOperator !== 'BETWEEN'
							? <InputField placeholder={ filterOperator === 'IN' && 'enter ie. 0,10,15,20' } onChange={ ( val ) => setFilterVal( val ) } />
							: <RangeInputs onChange={ ( val ) => setFilterVal( val ) } />
						}

						<div className="Buttons flex flex-align-center">
							<Button className="simple" onClick={ () => activatePanel( false ) }>{ __( 'Cancel' ) }</Button>
							<Button active disabled={ filterVal ? false : true } onClick={ handleSaveFilter }>{ __( 'Save' ) }</Button>
						</div>
					</div>
				}
			</div>

			{ activeFilters?.length > 0 &&
				<Button className="simple underline" onClick={ () => handleRemoveFilter( activeFilters ) }>{ __( 'Clear filters' ) }</Button>
			}
		</div>
	);
}
