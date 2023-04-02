
import { useEffect, useState, useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { stringOp, numericOp } from '../lib/filterOperators';
import { useFilter } from '../hooks/filteringSorting';

import Button from '../elements/Button';
import SortMenu from '../elements/SortMenu';
import InputField from '../elements/InputField';
import RangeInputs from '../elements/RangeInputs';
import LangMenu from '../elements/LangMenu';

export default function TableFilterPanel( { props, onEdit } ) {
	const { key, slug, header, possibleFilters, initialRow, currentFilters } = props;
	const { __ } = useI18n();
	const defaultOp = useRef();
	const didMountRef = useRef( false );
	const [ cellMenu, setCellMenu ] = useState();

	const { state, dispatch, handleType } = useFilter( { slug, header, possibleFilters, initialRow } );

	const notBetween = Object.keys( currentFilters )?.length && currentFilters[ key ]?.op ? currentFilters[ key ]?.op !== 'BETWEEN' : state.filterObj.filterOp !== 'BETWEEN';

	const checkedOp = currentFilters[ key ]?.op;

	const handleKeyChange = ( keyParam ) => {
		handleType( keyParam, ( cellElement ) => setCellMenu( cellElement ) );
		dispatch( { type: 'setFilterKey', key: keyParam } );
		dispatch( { type: 'setFilterOp', op: state.filterObj.keyType === 'number' ? Object.keys( numericOp )[ 0 ] : Object.keys( stringOp )[ 0 ] } );
	};

	console.log( state.filterObj );
	console.log( currentFilters[ key ] );

	useEffect( () => {
		dispatch( { type: 'setFilterKey', key: key || Object.keys( possibleFilters )[ 0 ] } );
		handleType( key || Object.keys( possibleFilters )[ 0 ], ( cellElement ) => setCellMenu( cellElement ) );
		// dispatch( { type: 'setFilterOp', op: checkedOp || ( ! checkedOp && state.filterObj.keyType ) === 'number' ? 'exactly' : 'LIKE' } );
		dispatch( { type: 'setFilterOp', op: currentFilters[ key ]?.op } );
		dispatch( { type: 'setFilterVal', val: currentFilters[ key ]?.val } );

		window.addEventListener( 'keyup', ( event ) => {
			if ( event.key === 'Escape' ) {
				onEdit( false );
			}
			if ( event.key === 'Enter' && state.filterObj.val ) {
				onEdit( state.filterObj );
			}
		}
		);
	}, [ ] );

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
					defaultAccept
					autoClose
					disabled={ key ? true : false }
					onChange={ handleKeyChange }
				/>
				<SortMenu
					className="ml-s"
					items={ state.filterObj.keyType === 'number' ? numericOp : stringOp }
					name="filter_ops"
					defaultAccept
					autoClose
					checkedId={ currentFilters[ key ]?.op || ( ! checkedOp && state.filterObj.keyType ) === 'number' ? Object.keys( numericOp )[ 0 ] : Object.keys( stringOp )[ 0 ] }
					onChange={ ( op ) => dispatch( { type: 'setFilterOp', op } ) }
				/>
			</div>
			{
				state.filterObj.keyType === 'lang' &&
				<LangMenu autoClose checkedId="all" defaultAccept onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
			}
			{ state.filterObj.keyType !== 'lang' && state.filterObj.keyType !== 'menu' && notBetween
				? <InputField liveUpdate defaultValue={ currentFilters[ key ]?.val } placeholder={ state.filterObj.filterOp === 'IN' ? 'enter ie. 0,10,15,20' : 'Enter search term' } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
				: <RangeInputs liveUpdate onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
			}
			{ /* { JSON.stringify( state.filterObj ) } */ }

			<div className="Buttons mt-m flex flex-align-center">
				<Button className="ma-left simple wide" onClick={ () => onEdit( false ) }>{ __( 'Cancel' ) }</Button>
				<Button active className="wide" disabled={ state.filterObj.filterVal ? false : true } onClick={ () => onEdit( state.filterObj ) }>{ __( 'Save' ) }</Button>
			</div>
		</div>
	);
}
