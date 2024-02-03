import { memo, useCallback } from 'react';
import { __ } from '@wordpress/i18n';

import { useFilter } from '../hooks/useFilteringSorting';
import useTableStore from '../hooks/useTableStore';

import TableFilterPanel from './TableFilterPanel';
import TableFilter from './TableFilter';

import Button from '@mui/joy/Button';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

// customData: includes values provided outside tables, when table global states are not defined, ie. header data
// hiddenFilters: ability to hide some filters, hidden filters are still available in appropriate global state, but are handled outside TableFilters component
const TableFilters = ( { customSlug, customData, hiddenFilters } ) => {
	let slug = useTableStore( ( state ) => state.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}

	const filters = useTableStore( ( state ) => state.getFilters )( slug );

	const { state, dispatch, handleSaveFilter, handleRemoveFilter } = useFilter( slug, customData );
	const { columnTypes, isSuccessColumnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );

	const columnTypesLoaded = columnTypes && Object.keys( columnTypes ).length > 0;

	const handleOnEdit = useCallback( ( returnObj ) => {
		if ( returnObj ) {
			handleSaveFilter( returnObj );
		}
		if ( ! returnObj ) {
			dispatch( { type: 'toggleEditFilter', editFilter: false } );
		}
	}, [ handleSaveFilter, dispatch ] );

	return (
		<div className="flex flex-align-center flex-wrap">
			<div className="pos-relative mr-s FilterButton">
				<Button
					className="underline"
					variant="plain"
					color="neutral"
					loading={ isLoadingColumnTypes }
					disabled={ ! isSuccessColumnTypes || ! columnTypesLoaded }
					onClick={ () => dispatch( { type: 'toggleEditFilter', editFilter: 'addFilter' } ) }
				>
					{ __( '+ Add filter' ) }
				</Button>

				{ columnTypesLoaded && state.editFilter === 'addFilter' &&
					<TableFilterPanel
						onEdit={ ( val ) => {
							handleOnEdit( val );
						} }
						customSlug={ slug }
						customData={ customData }
						hiddenFilters={ hiddenFilters }
					/>
				}
			</div>

			{ columnTypesLoaded && Object.keys( filters ).length !== 0 &&
				<TableFilter
					props={ { state } }
					onEdit={ handleOnEdit }
					onRemove={ ( key ) => {
						handleRemoveFilter( key );
					} }
					customSlug={ slug }
					customData={ customData }
					hiddenFilters={ hiddenFilters }
				/>
			}
		</div>
	);
};

export default memo( TableFilters );
