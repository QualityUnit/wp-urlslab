
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

import { stringOp, dateOp, numericOp, menuOp, langOp, tagsOp, booleanTypes } from '../lib/filterOperators';
import { dateWithTimezone, is12hourFormat } from '../lib/helpers';
import { useFilter } from '../hooks/filteringSorting';
import useTableStore from '../hooks/useTableStore';

import SingleSelectMenu from '../elements/SingleSelectMenu';
import InputField from '../elements/InputField';
import RangeInputs from '../elements/RangeInputs';
import LangMenu from '../elements/LangMenu';
import DatePicker from 'react-datepicker';
import TagsFilterMenu from '../elements/TagsFilterMenu';

import '../assets/styles/components/_FloatingPanel.scss';

export default function TableFilterPanel( { props, onEdit } ) {
	const currentDate = new Date();
	const { __ } = useI18n();
	const { key } = props || {};
	const keyWithoutId = key?.replace( /(.+?)@\d+/, '$1' );
	const header = useTableStore( ( state ) => state.header );
	const filters = useTableStore( ( state ) => state.filters );
	const initialRow = useTableStore( ( state ) => state.initialRow );

	const [ filterValMenu, setFilterValMenu ] = useState();
	const [ date, setDate ] = useState( filters[ key ]?.val ? new Date( filters[ key ]?.val ) : currentDate );
	const [ startDate, setStartDate ] = useState( filters[ key ]?.val?.min ? new Date( filters[ key ]?.val.min ) : currentDate.setDate( currentDate.getDate() - 2 ) );
	const [ endDate, setEndDate ] = useState( filters[ key ]?.val?.max ? new Date( filters[ key ]?.val.max ) : currentDate );

	const { state, dispatch, handleType } = useFilter();

	const cellUnit = initialRow?.getVisibleCells()?.filter( ( cell ) => cell.column?.id === state.filterObj.filterKey )[ 0 ]?.column?.columnDef.unit;

	const notBetween = useMemo( () => {
		return state.filterObj.filterOp !== 'BETWEEN';
	}, [ state.filterObj.filterOp ] );

	const isMultiVal = useMemo( () => {
		return state.filterObj.filterOp === 'IN' || state.filterObj.filterOp === 'NOTIN';
	}, [ state.filterObj.filterOp ] );

	const calculateKb = useCallback( ( val ) => {
		if ( isMultiVal ) {
			const valuesArray = val.split( ',' );
			const newArray = [];

			if ( cellUnit === 'kB' ) {
				valuesArray.map( ( v ) => {
					newArray.push( v * 1024 );
					return false;
				} );
				return newArray;
			}
			return valuesArray;
		}

		if ( cellUnit === 'kB' ) {
			return val * 1024;
		}

		return val;
	}, [ cellUnit, isMultiVal ] );

	const handleKeyChange = useCallback( ( keyParam ) => {
		dispatch( { type: 'setFilterKey', key: keyParam } );
		handleType( keyParam, ( cellOptions ) => setFilterValMenu( cellOptions ) );
	}, [ dispatch, handleType ] );

	const handleOnEdit = useCallback( ( val ) => {
		onEdit( val );
	}, [ onEdit ] );

	useEffect( () => {
		if ( state.filterObj.keyType === undefined ) {
			dispatch( { type: 'setFilterKey', key: key || Object.keys( header )[ 0 ] } );
			handleType( key || Object.keys( header )[ 0 ], ( cellOptions ) => setFilterValMenu( cellOptions ) );
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
		if ( state.filterObj.keyType === 'labels' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || 'LIKE' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val } );
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
			<div className="urlslab-panel-header urslab-TableFilter-panel-header pb-m">
				<strong>{ __( 'Edit filter' ) }{ key ? ` ${ header[ keyWithoutId ] }` : '' }</strong>
			</div>
			<div className="flex mt-m mb-m flex-align-center">
				<SingleSelectMenu
					className="mr-s"
					items={ header }
					name="filters"
					defaultValue={ keyWithoutId || Object.keys( header )[ 0 ] }
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
							( state.filterObj.keyType === 'labels' && tagsOp ) ||
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
			<div key={ filters[ key ]?.op || state.filterObj.filterOp }>
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
					state.filterObj.keyType === 'labels' &&
					<TagsFilterMenu
						defaultValue={ filters[ key ]?.val }
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
					<InputField key={ isMultiVal } liveUpdate autoFocus defaultValue={ filters[ key ]?.val } placeholder={ isMultiVal ? 'enter ie. fistname,lastname,value1' : 'Enter search term' } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val: isMultiVal ? `[${ val }]` : val } ) } />
				}
				{ state.filterObj.keyType === 'number' && notBetween &&
					<InputField key={ isMultiVal } type={ isMultiVal ? 'text' : 'number' } liveUpdate autoFocus defaultValue={ cellUnit === 'kB' ? ( filters[ key ]?.val / 1024 ).toString() : filters[ key ]?.val.toString() } placeholder={ isMultiVal ? 'enter ie. 0,1,2,3' : `Enter size ${ cellUnit && 'in ' + cellUnit }` } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val: calculateKb( val ) } ) } />
				}

				{ state.filterObj.keyType === 'date' && notBetween && // Datepicker not between
					<div className="urlslab-inputField-datetime">
						<DatePicker
							className="urlslab-input"
							selected={ date }
							dateFormat={ `dd. MMMM yyyy, ${ is12hourFormat() ? 'hh:mm a' : 'HH:mm' }` }
							timeFormat={ `${ is12hourFormat() ? 'hh:mm a' : 'HH:mm' }` }
							showTimeSelect
							onChange={ ( val ) => {
								const { origDate, correctedDate } = dateWithTimezone( val );
								setDate( origDate );
								dispatch( { type: 'setFilterVal', val: correctedDate.replace( /^(.+?)T(.+?)\..+$/g, '$1 $2' ) } );
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
								dateFormat={ `dd. MMMM yyyy, ${ is12hourFormat() ? 'hh:mm a' : 'HH:mm' }` }
								timeFormat={ `${ is12hourFormat() ? 'hh:mm a' : 'HH:mm' }` }
								showTimeSelect
								selectsStart
								startDate={ startDate }
								endDate={ endDate }
								maxDate={ endDate }
								onChange={ ( val ) => {
									const { origDate, correctedDate } = dateWithTimezone( val );
									setStartDate( origDate );
									dispatch( { type: 'setFilterVal', val: { ...state.filterObj.filterVal, min: correctedDate.replace( /^(.+?)T(.+?)\..+$/g, '$1 $2' ) } } );
								} }
							/>
						</div>
						—
						<div className="urlslab-inputField-datetime">
							<DatePicker
								className="urlslab-input"
								selected={ endDate }
								dateFormat={ `dd. MMMM yyyy, ${ is12hourFormat() ? 'hh:mm a' : 'HH:mm' }` }
								timeFormat={ `${ is12hourFormat() ? 'hh:mm a' : 'HH:mm' }` }
								selectsEnd
								showTimeSelect
								startDate={ startDate }
								endDate={ endDate }
								minDate={ startDate }
								onChange={ ( val ) => {
									const { origDate, correctedDate } = dateWithTimezone( val );
									setEndDate( origDate );
									dispatch( { type: 'setFilterVal', val: { ...state.filterObj.filterVal, max: correctedDate.replace( /^(.+?)T(.+?)\..+$/g, '$1 $2' ) } } );
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
				<Button variant="plain" color="neutral" onClick={ () => handleOnEdit( false ) } sx={ { ml: 'auto', mr: 1 } }>{ __( 'Cancel' ) }</Button>
				<Button disabled={ ( state.filterObj.filterVal || state.filterObj.filterVal === 0 ) ? false : true } onClick={ () => handleOnEdit( state.filterObj ) }>{ __( 'Save' ) }</Button>
			</div>
		</div>
	);
}
