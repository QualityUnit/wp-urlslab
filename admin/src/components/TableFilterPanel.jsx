
import { useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { stringOp, numericOp, menuOp, langOp } from '../lib/filterOperators';
import { useFilter } from '../hooks/filteringSorting';

import Button from '../elements/Button';
import SortMenu from '../elements/SortMenu';
import InputField from '../elements/InputField';
import RangeInputs from '../elements/RangeInputs';
import LangMenu from '../elements/LangMenu';

export default function TableFilterPanel( { props, onEdit } ) {
	const { key, slug, header, possibleFilters, initialRow, currentFilters } = props;
	const { __ } = useI18n();
	const [ filterValMenu, setFilterValMenu ] = useState();

	const { state, dispatch, handleType } = useFilter( { slug, header, possibleFilters, initialRow } );

	const notBetween = Object.keys( currentFilters )?.length && currentFilters[ key ]?.op ? currentFilters[ key ]?.op !== 'BETWEEN' : state.filterObj.filterOp !== 'BETWEEN';

	const checkedOp = currentFilters[ key ]?.op;

	const handleKeyChange = ( keyParam ) => {
		dispatch( { type: 'setFilterKey', key: keyParam } );
		handleType( keyParam, ( cellOptions ) => setFilterValMenu( cellOptions ) );
	};

	//console.log( state.filterObj );
	// console.log( currentFilters[ key ] );

	useEffect( () => {
		if ( state.filterObj.keyType === undefined ) {
			dispatch( { type: 'setFilterKey', key: key || Object.keys( possibleFilters )[ 0 ] } );
			handleType( key || Object.keys( possibleFilters )[ 0 ], ( cellOptions ) => setFilterValMenu( cellOptions ) );
		}
		if ( state.filterObj.keyType === 'string' ) {
			dispatch( { type: 'setFilterOp', op: checkedOp || 'LIKE' } );
			dispatch( { type: 'setFilterVal', val: currentFilters[ key ]?.val } );
		}

		if ( state.filterObj.keyType === 'number' ) {
			dispatch( { type: 'setFilterOp', op: checkedOp || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: currentFilters[ key ]?.val } );
		}
		if ( state.filterObj.keyType === 'menu' ) {
			dispatch( { type: 'setFilterOp', op: checkedOp || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: currentFilters[ key ]?.val || Object.keys( filterValMenu )[ 0 ] } );
		}
		if ( state.filterObj.keyType === 'lang' ) {
			dispatch( { type: 'setFilterOp', op: checkedOp || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: currentFilters[ key ]?.val || 'all' } );
		}

		window.addEventListener( 'keyup', ( event ) => {
			if ( event.key === 'Escape' ) {
				onEdit( false );
			}
			if ( event.key === 'Enter' && state.filterObj.filterVal ) {
				event.target.blur();
				onEdit( state.filterObj );
			}
		}
		);
	}, [ state.filterObj.keyType ] );

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
					items={
						( state.filterObj.keyType === 'number' && numericOp ) ||
            ( state.filterObj.keyType === 'string' && stringOp ) ||
            ( state.filterObj.keyType === 'lang' && langOp ) ||
            ( state.filterObj.keyType === 'menu' && menuOp )
					}
					name="filter_ops"
					defaultAccept
					autoClose
					checkedId={ checkedOp || ( ! checkedOp && state.filterObj.keyType ) === 'number' ? Object.keys( numericOp )[ 0 ] : Object.keys( stringOp )[ 0 ] }
					onChange={ ( op ) => dispatch( { type: 'setFilterOp', op } ) }
				/>
			</div>
			<div>
				{ state.filterObj.keyType === 'lang' &&
				<LangMenu autoClose multiSelect={ state.filterObj.filterOp === 'IN' } checkedId={ currentFilters[ key ]?.val || 'all' } defaultAccept onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
				}
				{
					state.filterObj.keyType === 'menu' &&
					<SortMenu
						items={ filterValMenu }
						name="menu_ops"
						defaultAccept
						autoClose
						checkedId={ currentFilters[ key ]?.val || Object.keys( filterValMenu )[ 0 ] }
						onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) }
					/>
				}
				{ state.filterObj.keyType !== 'lang' && state.filterObj.keyType !== 'menu' && notBetween &&
				<InputField liveUpdate autoFocus defaultValue={ currentFilters[ key ]?.val } placeholder={ state.filterObj.filterOp === 'IN' ? 'enter ie. 0,10,15,20' : 'Enter search term' } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
				}
				{ ! notBetween &&
				<RangeInputs liveUpdate
					defaultMin={ currentFilters[ key ]?.val.min }
					defaultMax={ currentFilters[ key ]?.val.max }
					onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) }
				/>
				}
			</div>

			<div className="Buttons mt-m flex flex-align-center">
				<Button className="ma-left simple wide" onClick={ () => onEdit( false ) }>{ __( 'Cancel' ) }</Button>
				<Button active className="wide" disabled={ state.filterObj.filterVal ? false : true } onClick={ () => onEdit( state.filterObj ) }>{ __( 'Save' ) }</Button>
			</div>
		</div>
	);
}
