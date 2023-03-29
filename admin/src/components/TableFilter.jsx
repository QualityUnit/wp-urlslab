import { useRef, useEffect, useState } from 'react';
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
	const [ activeFilters, setActiveFilters ] = useState();

	const possibleFilters = useRef( { ...header } );

	const { state, dispatch, handleRemoveFilter } = useFilter( { slug, header, possibleFilters, initialRow } );

	const handleOnFilter = ( response ) => {
		const { filters, currentFilters } = response;
		setActiveFilters( Object.keys( currentFilters ) );

		// console.log( response );
		onFilter( { filters, currentFilters } );
	};

	return (
		<div className="flex flex-align-center flex-wrap">
			{ header && activeFilters?.map( ( key ) => {
				return ( <Button
					key={ key }
					className="outline ml-s"
					// onClick={ handleEditFilter }
				>
					{ header[ key ] }
					<CloseIcon className="close" onClick={ () => {
						console.log( key );
						handleRemoveFilter( [ key ] ); runFilter.current = true;
					} } />
				</Button> );
			} ) }

			<TableFilterPanel props={ { slug, header, possibleFilters, initialRow } } onFilter={ ( val ) => handleOnFilter( val ) } />

			{ activeFilters?.length > 0 &&
				<Button className="simple underline" onClick={ () => {
					handleRemoveFilter( activeFilters ); runFilter.current = true;
				} }>{ __( 'Clear filters' ) }</Button>
			}
		</div>
	);
}
