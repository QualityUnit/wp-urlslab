
import { useRef, useMemo, useEffect, useState, useCallback, memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

import { stringOp, dateOp, browserOp, numericOp, menuOp, langOp, countryOp, tagsOp, booleanTypes } from '../lib/filterOperators';
import { dateWithTimezone, getDateFnsFormat } from '../lib/helpers';
import { useFilter } from '../hooks/useFilteringSorting';
import useTableStore from '../hooks/useTableStore';

import SingleSelectMenu from '../elements/SingleSelectMenu';
import InputField from '../elements/InputField';
import RangeInputs from '../elements/RangeInputs';
import LangMenu from '../elements/LangMenu';
import DatePicker from 'react-datepicker';
import TagsFilterMenu from '../elements/TagsFilterMenu';

import '../assets/styles/components/_FloatingPanel.scss';
import CountrySelect from '../elements/CountrySelect';
import BrowserSelect from '../elements/BrowserSelect';

function TableFilterPanel( { props, onEdit, customSlug, customData } ) {
	const currentDate = new Date();
	const { __ } = useI18n();
	const { key } = props || {};
	const keyWithoutId = key?.replace( /(.+?)@\d+/, '$1' );
	const ref = useRef();

	let slug = useTableStore( ( state ) => state.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}

	let header = useTableStore( ( state ) => state.tables[ slug ]?.header );
	if ( ! header && customData?.header ) {
		header = customData.header;
	}

	const filters = useTableStore( ( state ) => state.tables[ slug ]?.filters || {} );
	const [ filterValMenu, setFilterValMenu ] = useState();
	const [ date, setDate ] = useState( filters[ key ]?.val ? new Date( filters[ key ]?.val ) : currentDate );
	const [ startDate, setStartDate ] = useState( filters[ key ]?.val?.min ? new Date( filters[ key ]?.val.min ) : currentDate.setDate( currentDate.getDate() - 2 ) );
	const [ endDate, setEndDate ] = useState( filters[ key ]?.val?.max ? new Date( filters[ key ]?.val.max ) : currentDate );

	const { state, dispatch, handleType } = useFilter( slug );

	if ( state.filterObj.keyType === undefined ) {
		dispatch( { type: 'setFilterKey', key: key || Object.keys( header )[ 0 ] } );
		handleType( key || Object.keys( header )[ 0 ], ( cellOptions ) => setFilterValMenu( cellOptions ) );
	}

	const notBetween = useMemo( () => {
		return state.filterObj.filterOp !== 'BETWEEN';
	}, [ state.filterObj.filterOp ] );

	const isMultiVal = useMemo( () => {
		return state.filterObj.filterOp === 'IN' || state.filterObj.filterOp === 'NOTIN';
	}, [ state.filterObj.filterOp ] );

	const handleKeyChange = useCallback( ( keyParam ) => {
		dispatch( { type: 'setFilterKey', key: keyParam } );
		handleType( keyParam, ( cellOptions ) => setFilterValMenu( cellOptions ) );
	}, [ dispatch, handleType ] );

	const handleOnEdit = useCallback( ( val ) => {
		onEdit( val );
	}, [ onEdit ] );

	useEffect( () => {
		if ( state.filterObj.keyType === 'string' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || 'LIKE' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val } );
		}

		if ( state.filterObj.keyType === 'browser' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || 'LIKE' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val } );
		}

		if ( state.filterObj.keyType === 'date' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || '=' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val } );
		}

		if ( state.filterObj.keyType === 'number' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || '=' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val } );
		}
		if ( state.filterObj.keyType === 'menu' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || '=' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val || Object.keys( filterValMenu )[ 0 ] } );
		}
		if ( state.filterObj.keyType === 'boolean' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || '=' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val || Object.keys( booleanTypes )[ 0 ] } );
		}
		if ( state.filterObj.keyType === 'lang' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || '=' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val || 'all' } );
		}
		if ( state.filterObj.keyType === 'country' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || '=' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val || 'us' } );
		}
		if ( state.filterObj.keyType === 'labels' ) {
			dispatch( { type: 'setFilterOp', op: filters[ key ]?.op || 'LIKE' } );
			dispatch( { type: 'setFilterVal', val: filters[ key ]?.val } );
		}
	}, [ header, state.filterObj.keyType ] );

	useEffect( () => {
		window.addEventListener( 'keydown', ( event ) => {
			if ( event.key === 'Escape' ) {
				onEdit( false );
			}
		} );
		window.addEventListener( 'click', ( event ) => {
			if ( ! ref.current?.contains( event.target ) && ! event.target.closest( '.FilterButton' ) && ! event.target.closest( '.MuiAutocomplete-listbox' ) ) {
				onEdit( false );
			}
		} );
	}, [ onEdit ] );

	return (
		<div ref={ ref } className={ `urlslab-panel fadeInto urslab-floating-panel urslab-TableFilter-panel` }>
			<div className="urlslab-panel-header urslab-TableFilter-panel-header pb-m">
				<strong>{ __( 'Edit filter' ) }{ key ? ` ${ header[ keyWithoutId ] }` : '' }</strong>
			</div>
			<div className="flex mt-m mb-m flex-align-center">
				<SingleSelectMenu
					className="mr-s"
					items={ header }
					name="filters"
					key={ keyWithoutId || state.filterObj.filterKey }
					defaultValue={ keyWithoutId || state.filterObj.filterKey || Object.keys( header )[ 0 ] }
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
							( state.filterObj.keyType === 'browser' && browserOp ) ||
							( state.filterObj.keyType === 'number' && numericOp ) ||
							( state.filterObj.keyType === 'string' && stringOp ) ||
							( state.filterObj.keyType === 'lang' && langOp ) ||
							( state.filterObj.keyType === 'country' && countryOp ) ||
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
					<LangMenu defaultValue={ filters[ key ]?.val } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
				}
				{ state.filterObj.keyType === 'country' &&
					<CountrySelect value={ state.filterObj.filterVal } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
				}
				{
					state.filterObj.keyType === 'menu' &&
					<SingleSelectMenu
						key={ filters[ key ]?.val || Object.keys( filterValMenu )[ 0 ] }
						items={ filterValMenu }
						name="menu_vals"
						defaultAccept
						autoClose
						defaultValue={ filters[ key ]?.val || Object.keys( filterValMenu )[ 0 ] }
						onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) }
					/>
				}
				{
					state.filterObj.keyType === 'browser' &&
					<BrowserSelect
						defaultValue={ filters[ key ]?.val }
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
					<InputField key={ isMultiVal } autoFocus defaultValue={ filters[ key ]?.val } placeholder={ isMultiVal ? __( 'enter ie. fistname,lastname,value1' ) : __( 'Enter search term' ) } onKeyUp={ ( event ) => dispatch( { type: 'setFilterVal', val: isMultiVal ? `[${ event.target.value }]` : event.target.value } ) } onKeyDown={ ( event ) => event.key === 'Enter' && handleOnEdit( state.filterObj ) } />
				}
				{ state.filterObj.keyType === 'number' && notBetween &&
					<InputField key={ isMultiVal } type={ isMultiVal ? 'text' : 'number' } autoFocus
						defaultValue={ filters[ key ]?.val.toString() }
						// eslint-disable-next-line no-nested-ternary
						placeholder={ isMultiVal
							? __( 'enter ie. 0,1,2,3' )
							: __( 'Enter size' )
						}
						onKeyUp={ ( event ) => dispatch( { type: 'setFilterVal', val: isMultiVal ? event.target.value.split( ',' ) : event.target.value } ) } onKeyDown={ ( event ) => event.key === 'Enter' && handleOnEdit( state.filterObj ) } />
				}

				{ state.filterObj.keyType === 'date' && notBetween && // Datepicker not between
					<div className="urlslab-inputField-datetime">
						<DatePicker
							className="urlslab-input"
							selected={ date }
							dateFormat={ getDateFnsFormat().datetime }
							timeFormat={ getDateFnsFormat().time }
							calendarStartDay={ window.wp.date.getSettings().l10n.startOfWeek }
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
								dateFormat={ getDateFnsFormat().datetime }
								timeFormat={ getDateFnsFormat().time }
								calendarStartDay={ window.wp.date.getSettings().l10n.startOfWeek }
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
								dateFormat={ getDateFnsFormat().datetime }
								timeFormat={ getDateFnsFormat().time }
								calendarStartDay={ window.wp.date.getSettings().l10n.startOfWeek }
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

export default memo( TableFilterPanel );
