
import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { stringOp, dateOp, numericOp, menuOp, langOp, booleanTypes } from '../lib/filterOperators';
import { useFilter } from '../hooks/filteringSorting';

import Button from '../elements/Button';
import SortMenu from '../elements/SortMenu';
import InputField from '../elements/InputField';
import RangeInputs from '../elements/RangeInputs';
import LangMenu from '../elements/LangMenu';
import DatePicker from 'react-datepicker';

export default function TableFilterPanel( { props, onEdit } ) {
	const currentDate = new Date();
	const { key, slug, header, possibleFilters, initialRow, currentFilters } = props;
	const { __ } = useI18n();
	const filterPanel = useRef();
	const [ filterValMenu, setFilterValMenu ] = useState();
	const [ date, setDate ] = useState( currentFilters[ key ]?.val ? new Date( currentFilters[ key ]?.val ) : currentDate );
	const [ startDate, setStartDate ] = useState( currentFilters[ key ]?.val?.min ? new Date( currentFilters[ key ]?.val.min ) : currentDate.setDate( currentDate.getDate() - 2 ) );
	const [ endDate, setEndDate ] = useState( currentFilters[ key ]?.val?.max ? new Date( currentFilters[ key ]?.val.max ) : currentDate );

	const { state, dispatch, handleType } = useFilter( { slug, header, initialRow } );

	const cellUnit = initialRow?.getVisibleCells()?.filter( ( cell ) => cell.column?.id === state.filterObj.filterKey )[ 0 ]?.column?.columnDef.unit;

	const notBetween = useMemo( () => {
		return Object.keys( currentFilters )?.length && currentFilters[ key ]?.op ? currentFilters[ key ]?.op !== 'BETWEEN' : state.filterObj.filterOp !== 'BETWEEN';
	}, [ currentFilters, key, state.filterObj.filterOp ] );

	const handleKeyChange = useCallback( ( keyParam ) => {
		dispatch( { type: 'setFilterKey', key: keyParam } );
		handleType( keyParam, ( cellOptions ) => setFilterValMenu( cellOptions ) );
	}, [ dispatch, handleType ] );

	useEffect( () => {
		if ( state.filterObj.keyType === undefined ) {
			dispatch( { type: 'setFilterKey', key: key || Object.keys( possibleFilters )[ 0 ] } );
			handleType( key || Object.keys( possibleFilters )[ 0 ], ( cellOptions ) => setFilterValMenu( cellOptions ) );
		}
		if ( state.filterObj.keyType === 'string' ) {
			dispatch( { type: 'setFilterOp', op: currentFilters[ key ]?.op || 'LIKE' } );
			dispatch( { type: 'setFilterVal', val: currentFilters[ key ]?.val } );
		}

		if ( state.filterObj.keyType === 'date' ) {
			dispatch( { type: 'setFilterOp', op: currentFilters[ key ]?.op || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: currentFilters[ key ]?.val } );
		}

		if ( state.filterObj.keyType === 'number' ) {
			dispatch( { type: 'setFilterOp', op: currentFilters[ key ]?.op || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: currentFilters[ key ]?.val } );
		}
		if ( state.filterObj.keyType === 'menu' ) {
			dispatch( { type: 'setFilterOp', op: currentFilters[ key ]?.op || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: currentFilters[ key ]?.val || Object.keys( filterValMenu )[ 0 ] } );
		}
		if ( state.filterObj.keyType === 'boolean' ) {
			dispatch( { type: 'setFilterOp', op: currentFilters[ key ]?.op || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: currentFilters[ key ]?.val || Object.keys( booleanTypes )[ 0 ] } );
		}
		if ( state.filterObj.keyType === 'lang' ) {
			dispatch( { type: 'setFilterOp', op: currentFilters[ key ]?.op || 'exactly' } );
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
		<div ref={ filterPanel } className={ `urlslab-panel fadeInto urslab-TableFilter-panel pos-absolute` }>
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
				{ ( state.filterObj.keyType && ( currentFilters[ key ]?.op || state.filterObj.filterOp ) ) &&
					<SortMenu
						className="ml-s"
						items={
							( state.filterObj.keyType === 'date' && dateOp ) ||
							( state.filterObj.keyType === 'number' && numericOp ) ||
							( state.filterObj.keyType === 'string' && stringOp ) ||
							( state.filterObj.keyType === 'lang' && langOp ) ||
							( state.filterObj.keyType === 'menu' && menuOp ) ||
							( state.filterObj.keyType === 'boolean' && menuOp )
						}
						name="filter_ops"
						defaultAccept
						autoClose
						checkedId={ currentFilters[ key ]?.op || state.filterObj.filterOp }
						onChange={ ( op ) => dispatch( { type: 'setFilterOp', op } ) }
					/>
				}
			</div>
			<div>
				{ state.filterObj.keyType === 'lang' &&
				<LangMenu autoClose multiSelect={ state.filterObj.filterOp === 'IN' } checkedId={ currentFilters[ key ]?.val || 'all' } defaultAccept onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
				}
				{
					state.filterObj.keyType === 'menu' &&
					<SortMenu
						items={ filterValMenu }
						name="menu_vals"
						defaultAccept
						autoClose
						checkedId={ currentFilters[ key ]?.val || Object.keys( filterValMenu )[ 0 ] }
						onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) }
					/>
				}
				{
					state.filterObj.keyType === 'boolean' &&
					<SortMenu
						items={ booleanTypes }
						name="boolean_vals"
						defaultAccept
						autoClose
						checkedId={ currentFilters[ key ]?.val || Object.keys( booleanTypes )[ 0 ] }
						onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) }
					/>
				}
				{ state.filterObj.keyType === 'string' && notBetween &&
					<InputField liveUpdate autoFocus defaultValue={ currentFilters[ key ]?.val } placeholder={ state.filterObj.filterOp === 'IN' ? 'enter ie. 0,10,15,20' : 'Enter search term' } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
				}
				{ state.filterObj.keyType === 'number' && notBetween &&
					<InputField type="number" liveUpdate autoFocus defaultValue={ cellUnit === 'kB' ? currentFilters[ key ]?.val / 1024 : currentFilters[ key ]?.val } placeholder={ state.filterObj.filterOp === 'IN' ? 'enter ie. 0,10,15,20' : `Enter size ${ cellUnit && 'in ' + cellUnit }` } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val: cellUnit === 'kB' ? val * 1024 : val } ) } />
				}

				{ state.filterObj.keyType === 'date' && notBetween && // Datepicker not between
					<div className="urlslab-inputField-datetime">
						<DatePicker
							className="urlslab-input"
							selected={ date }
							dateFormat="dd. MMMM yyyy, HH:mm"
							timeFormat="HH:mm"
							showTimeSelect
							onChange={ ( val ) => {
								setDate( new Date( val ) );
								dispatch( { type: 'setFilterVal', val: val.toISOString().replace( /^(.+?)T(.+?)\..+$/g, '$1 $2' ) } );
							} }
						/>
					</div>
				}
				{ state.filterObj.keyType === 'date' && ! notBetween && // Datepicker between range
					<div className="urlslab-datetime-range">

						<div className="urlslab-inputField-datetime">
							<DatePicker
								className="urlslab-input"
								selected={ startDate }
								dateFormat="dd. MMMM yyyy, HH:mm"
								timeFormat="HH:mm"
								showTimeSelect
								selectsStart
								startDate={ startDate }
								endDate={ endDate }
								maxDate={ endDate }
								onChange={ ( val ) => {
									setStartDate( new Date( val ) );
									dispatch( { type: 'setFilterVal', val: { ...state.filterObj.filterVal, min: val.toISOString().replace( /^(.+?)T(.+?)\..+$/g, '$1 $2' ) } } );
								} }
							/>
						</div>
						—
						<div className="urlslab-inputField-datetime">
							<DatePicker
								className="urlslab-input"
								selected={ endDate }
								dateFormat="dd. MMMM yyyy, HH:mm"
								timeFormat="HH:mm"
								selectsEnd
								showTimeSelect
								startDate={ startDate }
								endDate={ endDate }
								minDate={ startDate }
								onChange={ ( val ) => {
									setEndDate( new Date( val ) );
									dispatch( { type: 'setFilterVal', val: { ...state.filterObj.filterVal, max: val.toISOString().replace( /^(.+?)T(.+?)\..+$/g, '$1 $2' ) } } );
								} }
							/>
						</div>
					</div>
				}
				{ state.filterObj.keyType === 'number' && ! notBetween &&
				<RangeInputs liveUpdate
					unit={ cellUnit }
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
