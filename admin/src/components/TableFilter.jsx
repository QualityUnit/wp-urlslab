import { useRef, useEffect, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { useFilter } from '../hooks/filteringSorting';
import { langName } from '../lib/helpers';

import Button from '../elements/Button';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';

import '../assets/styles/components/_TableFilter.scss';
import TableFilterPanel from './TableFilterPanel';

export default function TableFilter( { slug, header, initialRow, onFilter } ) {
	const { __ } = useI18n();
	const didMountRef = useRef( false );

	const { filters, currentFilters, state, dispatch, handleSaveFilter, handleRemoveFilter } = useFilter( { slug, header, initialRow } );

	const handleOnEdit = useCallback( ( returnObj ) => {
		if ( returnObj ) {
			handleSaveFilter( returnObj );
			onFilter( { filters, currentFilters } );
		}
		if ( ! returnObj ) {
			dispatch( { type: 'toggleEditFilter', editFilter: false } );
		}
	}, [ handleSaveFilter, filters, currentFilters, dispatch, onFilter ] );

	useEffect( () => {
		if ( onFilter && didMountRef.current ) {
			onFilter( { filters, currentFilters } );
		}
		didMountRef.current = true;
	}, [ filters, currentFilters, onFilter ] );

	const activeFilters = Object.keys( currentFilters ).length ? Object.keys( currentFilters ) : null;

	return (
		<div className="flex flex-align-center flex-wrap">
			{ header && activeFilters?.map( ( key ) => { // Iterating active filters
				return ( <Button
					key={ key }
					active={ state.editFilter === key ? true : false }
					className="outline ml-s pos-relative"
					onClick={ () => ! state.editFilter && dispatch( { type: 'toggleEditFilter', editFilter: key } ) }
				>
					{ header[ key ] }:&nbsp;
					<span className="regular flex">“<span className="limit-20">
						{ currentFilters[ key ]?.op === 'BETWEEN' && ! currentFilters?.lang
							? `min: ${ currentFilters[ key ]?.val.min }, max: ${ currentFilters[ key ]?.val.max }`
							: ! currentFilters?.lang && currentFilters[ key ]?.val
						}
						{ currentFilters?.lang &&
							langName( currentFilters?.lang?.val )
						}
					</span>”</span>
					<CloseIcon className="close" onClick={ () => {
						handleRemoveFilter( [ key ] );
					} } />
					{ state.editFilter === key && // Edit filter panel
						<TableFilterPanel props={ { key, slug, header, initialRow, possibleFilters: state.possibleFilters, currentFilters } } onEdit={ handleOnEdit } />
					}
				</Button> );
			} ) }

			<div className="pos-relative">
				<Button className="simple underline" onClick={ () => dispatch( { type: 'toggleEditFilter', editFilter: 'addFilter' } ) }>{ __( '+ Add filter' ) }
				</Button>

				{ state.editFilter === 'addFilter' && // Our main adding panel (only when Add button clicked)
					<TableFilterPanel props={ { slug, header, initialRow, possibleFilters: state.possibleFilters, currentFilters } } onEdit={ handleOnEdit } />
				}
			</div>

			{ activeFilters?.length > 0 && // Removes all used filters in given table
				<Button className="simple underline" onClick={ () => {
					handleRemoveFilter( activeFilters );
				} }>{ __( 'Clear filters' ) }</Button>
			}
		</div>
	);
}
