import { useRef, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient } from '@tanstack/react-query';

import { useFilter } from '../hooks/filteringSorting';
import { stringOp, numericOp } from '../constants/filterReducer';

import Button from '../elements/Button';
import SortMenu from '../elements/SortMenu';
import InputField from '../elements/InputField';
import RangeInputs from '../elements/RangeInputs';

export default function TableFilterPanel( { props, onFilter } ) {
	const { slug, header, possibleFilters, initialRow } = props;
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const filterPanel = useRef( null );
	const runFilter = useRef( false );

	const { filters, currentFilters, state, dispatch, handleType, handleSaveFilter, handleRemoveFilter } = useFilter( { slug, header, possibleFilters, initialRow } );

	if ( onFilter && runFilter.current ) {
		runFilter.current = false;
		// console.log( { filters, currentFilters } );
		onFilter( { filters, currentFilters } );
	}

	useEffect( () => {
		const filteringState = queryClient.getQueryData( [ slug, 'filters' ] );
		// console.log( filteringState );
		if ( filteringState?.possibleFilters ) {
			possibleFilters.current = filteringState?.possibleFilters;
		}

		const handleClickOutside = ( event ) => {
			if ( ! filterPanel.current?.contains( event.target ) && state.panelActive ) {
				dispatch( { type: 'toggleFilterPanel', panelActive: false } );
			}
		};

		// document.addEventListener( 'click', handleClickOutside, false );
	}, [ queryClient, slug, state.panelActive, dispatch ] );

	return (
		<div className="pos-relative">
			<Button className="simple underline" onClick={ () => dispatch( { type: 'toggleFilterPanel', panelActive: ! state.panelActive } ) }>{ __( '+ Add filter' ) }
			</Button>
			{ state.panelActive &&
				<div ref={ filterPanel } className="urlslab-panel urslab-TableFilter-panel pos-absolute">
					<div className="urlslab-panel-header urslab-TableFilter-panel-header"><strong>Edit filter</strong></div>
					<div className="flex mt-m mb-m flex-align-center">
						<SortMenu
							className="mr-s"
							items={ state.possibleFilters }
							name="filters"
							checkedId={ Object.keys( state.possibleFilters )[ 0 ] }
							autoClose
							onChange={ ( key ) => {
								handleType( key ); dispatch( { type: 'setFilterKey', key } );
							} }
						/>
						<SortMenu
							className="ml-s"
							items={ state.filterObj.isNumber ? numericOp : stringOp }
							name="filters"
							autoClose
							checkedId={ Object.keys( state.filterObj.isNumber ? numericOp : stringOp )[ 0 ] }
							onChange={ ( op ) => dispatch( { type: 'setFilterOp', op } ) }
						/>
					</div>
					{ state.filterObj.filterOp !== 'BETWEEN'
						? <InputField liveUpdate placeholder={ state.filterObj.filterOp === 'IN' && 'enter ie. 0,10,15,20' } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
						: <RangeInputs liveUpdate onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
					}

					<div className="Buttons mt-m flex flex-align-center">
						<Button className="ma-left simple wide" onClick={ () => dispatch( { type: 'toggleFilterPanel' } ) }>{ __( 'Cancel' ) }</Button>
						<Button active className="wide" disabled={ state.filterObj.filterVal ? false : true } onClick={ ( v ) => {
							handleSaveFilter( v ); runFilter.current = true;
						} }>{ __( 'Save' ) }</Button>
					</div>
				</div>
			}
		</div>
	);
}
