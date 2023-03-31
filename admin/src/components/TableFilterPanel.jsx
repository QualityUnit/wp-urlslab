
import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { stringOp, numericOp } from '../lib/filterOperators';
import { useFilter } from '../hooks/filteringSorting';

import Button from '../elements/Button';
import SortMenu from '../elements/SortMenu';
import InputField from '../elements/InputField';
import RangeInputs from '../elements/RangeInputs';

export default function TableFilterPanel( { props, onEdit } ) {
	const { key, slug, header, possibleFilters, initialRow, currentFilters } = props;
	const { __ } = useI18n();
	const [ cellMenu, setCellMenu ] = useState();

	const { state, dispatch, handleType } = useFilter( { slug, header, possibleFilters, initialRow } );

	const notBetween = Object.keys( currentFilters )?.length && currentFilters[ key ]?.op ? currentFilters[ key ]?.op !== 'BETWEEN' : state.filterObj.filterOp !== 'BETWEEN';

	const checkedOp = Object.keys( currentFilters )?.length ? currentFilters[ key ]?.op : Object.keys( state.filterObj.keyType === 'number' ? numericOp : stringOp )[ 0 ];

	useEffect( () => {
		console.log( 'bla' );
		console.log( state.filterObj.val );

		dispatch( { type: 'setFilterKey', key: key || Object.keys( possibleFilters )[ 0 ] } );
		dispatch( { type: 'setFilterOp', op: checkedOp } );
		dispatch( { type: 'setFilterVal', val: currentFilters[ key ]?.val } );
		handleType( key || Object.keys( possibleFilters )[ 0 ], ( cellElement ) => setCellMenu( cellElement ) );

		window.addEventListener( 'keyup', ( event ) => {
			if ( event.key === 'Escape' ) {
				onEdit( false );
			}
			if ( event.key === 'Enter' && state.filterObj.val ) {
				onEdit( state.filterObj );
			}
		}
		);
	}, [ onEdit, dispatch, possibleFilters, checkedOp, key, currentFilters ] );

	return (
		<div className="urlslab-panel urslab-TableFilter-panel pos-absolute">
			<div className="urlslab-panel-header urslab-TableFilter-panel-header">
				<strong>{ __( 'Edit filter' ) }{ key ? ` ${ header[ key ] }` : '' }</strong>
			</div>
			<div className="flex mt-m mb-m flex-align-center">
				<SortMenu
					className="mr-s"
					items={ key ? header : possibleFilters }
					name="filters"
					checkedId={ key || Object.keys( possibleFilters )[ 0 ] }
					autoClose
					disabled={ key ? true : false }
					onChange={ ( keyParam ) => {
						dispatch( { type: 'setFilterKey', key: keyParam } );
						handleType( keyParam, ( cellElement ) => setCellMenu( cellElement ) );
					} }
				/>
				{ state.filterObj.keyType !== 'menu'
					? <SortMenu
							className="ml-s"
							items={ state.filterObj.keyType === 'number' ? numericOp : stringOp }
							name="filters"
							autoClose
							checkedId={ checkedOp }
							onChange={ ( op ) => dispatch( { type: 'setFilterOp', op } ) }
					/>
					: cellMenu
				}
			</div>
			{ state.filterObj.keyType !== 'menu'
				? notBetween && <InputField liveUpdate defaultValue={ currentFilters[ key ]?.val } placeholder={ state.filterObj.filterOp === 'IN' && 'enter ie. 0,10,15,20' } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
				: ! notBetween && <RangeInputs liveUpdate onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
			}

			<div className="Buttons mt-m flex flex-align-center">
				<Button className="ma-left simple wide" onClick={ () => onEdit( false ) }>{ __( 'Cancel' ) }</Button>
				<Button active className="wide" disabled={ state.filterObj.filterVal ? false : true } onClick={ () => onEdit( state.filterObj ) }>{ __( 'Save' ) }</Button>
			</div>
		</div>
	);
}
