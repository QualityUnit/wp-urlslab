
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { stringOp, dateOp, numericOp, menuOp, langOp, booleanTypes } from '../lib/filterOperators';
import { useFilter } from '../hooks/filteringSorting';

import Button from '../elements/Button';
import SingleSelectMenu from '../elements/SingleSelectMenu';
import InputField from '../elements/InputField';
import RangeInputs from '../elements/RangeInputs';
import LangMenu from '../elements/LangMenu';
import DatePicker from 'react-datepicker';

import '../assets/styles/components/_FloatingPanel.scss';

export default function TableFilterPanel( { props, onEdit } ) {
	const currentDate = new Date();
	const { key, slug, header, possiblefilters, initialRow, filters } = props;
	const { __ } = useI18n();
	const [ filterValMenu, setFilterValMenu ] = useState();
	const [ date, setDate ] = useState( filters[ key ]?.val ? new Date( filters[ key ]?.val ) : currentDate );
	const [ startDate, setStartDate ] = useState( filters[ key ]?.val?.min ? new Date( filters[ key ]?.val.min ) : currentDate.setDate( currentDate.getDate() - 2 ) );
	const [ endDate, setEndDate ] = useState( filters[ key ]?.val?.max ? new Date( filters[ key ]?.val.max ) : currentDate );

	const { state, dispatch, handleType } = useFilter( { slug, header, initialRow } );

	const cellUnit = initialRow?.getVisibleCells()?.filter( ( cell ) => cell.column?.id === state.filterObj.filterKey )[ 0 ]?.column?.columnDef.unit;

	const notBetween = useMemo( () => {
		return Object.keys( filters )?.length && filters[ key ]?.op ? filters[ key ]?.op !== 'BETWEEN' : state.filterObj.filterOp !== 'BETWEEN';
	}, [ filters, key, state.filterObj.filterOp ] );

	const handleKeyChange = useCallback( ( keyParam ) => {
		dispatch( { type: 'setFilterKey', key: keyParam } );
		handleType( keyParam, ( cellOptions ) => setFilterValMenu( cellOptions ) );
	}, [ dispatch, handleType ] );

	const handleOnEdit = useCallback( ( val ) => {
		onEdit( val );
	}, [ onEdit ] );

	useEffect( () => {
		if ( state.filterObj.keyType === undefined ) {
			dispatch( { type: 'setFilterKey', key: key || Object.keys( possiblefilters )[ 0 ] } );
			handleType( key || Object.keys( possiblefilters )[ 0 ], ( cellOptions ) => setFilterValMenu( cellOptions ) );
		}
		if ( state.filterObj.keyType === 'string' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || 'LIKE' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val } );
		}

		if ( state.filterObj.keyType === 'date' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val } );
		}

		if ( state.filterObj.keyType === 'number' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val } );
		}
		if ( state.filterObj.keyType === 'menu' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val || Object.keys( filterValMenu )[ 0 ] } );
		}
		if ( state.filterObj.keyType === 'boolean' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val || Object.keys( booleanTypes )[ 0 ] } );
		}
		if ( state.filterObj.keyType === 'lang' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || 'exactly' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val || 'all' } );
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
		<div className={ `urlslab-panel fadeInto urslab-floating-panel urslab-TableFilter-panel` }>
			<div className="urlslab-panel-header urslab-TableFilter-panel-header">
				<strong>{ __( 'Edit filter' ) }{ key ? ` ${ header[ key ] }` : '' }</strong>
			</div>
			<div className="flex mt-m mb-m flex-align-center">
				<SingleSelectMenu
					className="mr-s"
					items={ key ? header : possiblefilters }
					name="filters"
					defaultValue={ key || Object.keys( possiblefilters )[ 0 ] }
					defaultAccept
					autoClose
					disabled={ key ? true : false }
					onChange={ handleKeyChange }
				/>
				{ ( state.filterObj.keyType && ( filters[ key ]?.op || state.filterObj.filterOp ) ) &&
					<SingleSelectMenu
						className="ml-s"
						key={ filters[ key ]?.op || state.filterObj.filterOp }
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
						defaultValue={ filters[ key ]?.op || state.filterObj.filterOp }
						onChange={ ( op ) => dispatch( { type: 'setFilterOp', op } ) }
					/>
				}
			</div>
			<div>
				{ state.filterObj.keyType === 'lang' &&
					<LangMenu autoClose multiSelect={ state.filterObj.filterOp === 'IN' } defaultValue={ filters[ key ]?.val || 'all' } defaultAccept onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
				}
				{
					state.filterObj.keyType === 'menu' &&
					<SingleSelectMenu
						items={ filterValMenu }
						name="menu_vals"
						defaultAccept
						autoClose
						defaultValue={ filters[ key ]?.val || Object.keys( filterValMenu )[ 0 ] }
						onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) }
					/>
				}
				{
					state.filterObj.keyType === 'boolean' &&
					<SingleSelectMenu
						items={ booleanTypes }
						name="boolean_vals"
						defaultAccept
						autoClose
						defaultValue={ filters[ key ]?.val || Object.keys( booleanTypes )[ 0 ] }
						onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) }
					/>
				}
				{ state.filterObj.keyType === 'string' && notBetween &&
					<InputField liveUpdate autoFocus defaultValue={ filters[ key ]?.val } placeholder={ state.filterObj.filterOp === 'IN' ? 'enter ie. 0,10,15,20' : 'Enter search term' } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
				}
				{ state.filterObj.keyType === 'number' && notBetween &&
					<InputField type="number" liveUpdate autoFocus defaultValue={ cellUnit === 'kB' ? filters[ key ]?.val / 1024 : filters[ key ]?.val } placeholder={ state.filterObj.filterOp === 'IN' ? 'enter ie. 0,10,15,20' : `Enter size ${ cellUnit && 'in ' + cellUnit }` } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val: cellUnit === 'kB' ? val * 1024 : val } ) } />
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
				<RangeInputs
					unit={ cellUnit }
					defaultMin={ filters[ key ]?.val.min }
					defaultMax={ filters[ key ]?.val.max }
					onChange={ ( val ) => dispatch( { type: 'setFilterVal', val: { min: val.min, max: val.max } } ) }
				/>
				}
			</div>

			<div className="Buttons mt-m flex flex-align-center">
				<Button className="ma-left simple wide" onClick={ () => handleOnEdit( false ) }>{ __( 'Cancel' ) }</Button>
				<Button active className="wide" disabled={ ( state.filterObj.filterVal || state.filterObj.filterVal === 0 ) ? false : true } onClick={ () => handleOnEdit( state.filterObj ) }>{ __( 'Save' ) }</Button>
			</div>
		</div>
	);
}
