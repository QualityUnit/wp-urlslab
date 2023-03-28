import { useRef, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient } from '@tanstack/react-query';

import { useFilter } from '../hooks/filteringSorting';
import { stringOp, numericOp } from '../constants/filterReducer';

import Button from '../elements/Button';
import SortMenu from '../elements/SortMenu';
import InputField from '../elements/InputField';
import RangeInputs from '../elements/RangeInputs';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';

import '../assets/styles/components/_TableFilter.scss';

export default function TableFilter( { slug, header, initialRow, onFilter } ) {
	const { __ } = useI18n();
	const filterPanel = useRef( null );
	const queryClient = useQueryClient();

	const possibleFilters = useRef( { ...header } );

	const { filters, currentFilters, state, dispatch, handleType, handleSaveFilter, handleRemoveFilter, runFilter } = useFilter( { slug, header, possibleFilters, initialRow } );

	const activeFilters = currentFilters ? Object.keys( currentFilters ) : null;

	if ( onFilter && runFilter.current ) {
		onFilter( { filters, currentFilters } );
	}

	useEffect( () => {
		const filteringState = queryClient.getQueryData( [ slug, 'filters' ] );
		if ( filteringState?.possibleFilters ) {
			possibleFilters.current = filteringState?.possibleFilters;
		}

		const handleClickOutside = ( event ) => {
			if ( ! filterPanel.current?.contains( event.target ) && state.panelActive ) {
				dispatch( { type: 'toggleFilterPanel', panelActive: false } );
			}
		};

		document.addEventListener( 'click', handleClickOutside, false );
	}, [ queryClient, slug, state.panelActive, dispatch ] );

	return (
		<div className="flex flex-align-center flex-wrap">
			{ header && activeFilters?.map( ( key ) => {
				return ( <Button
					key={ key }
					className="outline ml-s"
					// onClick={ handleEditFilter }
				>
					{ header[ key ] }
					<CloseIcon className="close" onClick={ () => handleRemoveFilter( [ key ] ) } />
				</Button> );
			} ) }

			<div className="pos-relative">
				<Button className="simple underline" onClick={ () => dispatch( { type: 'toggleFilterPanel', panelActive: true } ) }>{ __( '+ Add filter' ) }
				</Button>

				{ state.panelActive &&
					<div ref={ filterPanel } className="urlslab-panel urslab-TableFilter-panel pos-absolute">
						<div className="flex flex-align-center">
							<SortMenu
								className="mr-s"
								items={ state.possibleFilters }
								name="filters"
								checkedId={ Object.keys( state.possibleFilters )[ 0 ] }
								onChange={ ( key ) => {
									handleType( key ); dispatch( { type: 'setFilterKey', key } );
								} }
							/>
							<SortMenu
								className="ml-s"
								items={ state.filterObj.isNumber ? numericOp : stringOp }
								name="filters"
								checkedId={ Object.keys( state.filterObj.isNumber ? numericOp : stringOp )[ 0 ] }
								onChange={ ( op ) => dispatch( { type: 'setFilterOp', op } ) }
							/>
						</div>
						{ state.filterObj.filterOp !== 'BETWEEN'
							? <InputField placeholder={ state.filterObj.filterOp === 'IN' && 'enter ie. 0,10,15,20' } onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
							: <RangeInputs onChange={ ( val ) => dispatch( { type: 'setFilterVal', val } ) } />
						}

						<div className="Buttons flex flex-align-center">
							<Button className="simple" onClick={ () => dispatch( { type: 'toggleFilterPanel' } ) }>{ __( 'Cancel' ) }</Button>
							<Button active disabled={ state.filterObj.filterVal ? false : true } onClick={ handleSaveFilter }>{ __( 'Save' ) }</Button>
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
