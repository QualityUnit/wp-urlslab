import { useRef, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient } from '@tanstack/react-query';

import { useFilter } from '../hooks/filteringSorting';

import Button from '../elements/Button';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';

import '../assets/styles/components/_TableFilter.scss';
import TableFilterPanel from './TableFilterPanel';

export default function TableFilter( { slug, header, initialRow, onFilter } ) {
	const { __ } = useI18n();
	const runFilter = useRef( false );
	const queryClient = useQueryClient();

	const possibleFilters = useRef( { ...header } );

	const { filters, currentFilters, state, dispatch, handleSaveFilter, handleRemoveFilter } = useFilter( { slug, header, possibleFilters, initialRow } );

	const activeFilters = currentFilters ? Object.keys( currentFilters ) : null;

	if ( onFilter && runFilter.current ) {
		runFilter.current = false;
		onFilter( { filters, currentFilters } );
	}

	const handleOnEdit = ( returnObj ) => {
		if ( returnObj ) {
			handleSaveFilter( returnObj );
			runFilter.current = true;
		}
		if ( ! returnObj ) {
			dispatch( { type: 'toggleEditFilter', editFilter: false } );
		}
	};

	useEffect( () => {
		const filteringState = queryClient.getQueryData( [ slug, 'filters' ] );
		if ( filteringState?.possibleFilters ) {
			possibleFilters.current = filteringState?.possibleFilters;
		}
	}, [ queryClient, slug, dispatch ] );

	return (
		<div className="flex flex-align-center flex-wrap">
			{ header && activeFilters?.map( ( key ) => {
				return ( <Button
					key={ key }
					active={ state.editFilter ? true : false }
					className="outline ml-s pos-relative"
					onClick={ () => ! state.editFilter && dispatch( { type: 'toggleEditFilter', editFilter: key } ) }
				>
					{ header[ key ] }:&nbsp;<span className="regular flex">“<span className="limit-20">{ currentFilters[ key ]?.val }</span>”</span>
					<CloseIcon className="close" onClick={ () => {
						handleRemoveFilter( [ key ] ); runFilter.current = true;
					} } />
					{ state.editFilter === key &&
						<TableFilterPanel props={ { key, slug, header, initialRow, possibleFilters: state.possibleFilters } } onEdit={ handleOnEdit } />
					}
				</Button> );
			} ) }

			<div className="pos-relative">
				<Button className="simple underline" onClick={ () => dispatch( { type: 'toggleEditFilter', editFilter: 'addFilter' } ) }>{ __( '+ Add filter' ) }
				</Button>

				{ state.editFilter === 'addFilter' &&
					<TableFilterPanel props={ { slug, header, initialRow, possibleFilters: state.possibleFilters } } onEdit={ handleOnEdit } />
				}
			</div>

			{ activeFilters?.length > 0 &&
				<Button className="simple underline" onClick={ () => {
					handleRemoveFilter( activeFilters ); runFilter.current = true;
				} }>{ __( 'Clear filters' ) }</Button>
			}
		</div>
	);
}
