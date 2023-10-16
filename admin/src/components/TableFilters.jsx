import { memo, useCallback } from 'react';
import { __ } from '@wordpress/i18n';

import { useFilter } from '../hooks/useFilteringSorting';
import useTableStore from '../hooks/useTableStore';

import TableFilterPanel from './TableFilterPanel';
import TableFilter from './TableFilter';

import Button from '@mui/joy/Button';

const TableFilters = ( { customSlug } ) => {
	let slug = useTableStore( ( state ) => state.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}

	const filters = useTableStore( ( state ) => state.tables[ slug ]?.filters || {} );
	const { state, dispatch, handleSaveFilter, handleRemoveFilter } = useFilter( slug );

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
			<div className="pos-relative mr-s">
				<Button
					className="underline"
					variant="plain"
					color="neutral"
					onClick={ () => dispatch( { type: 'toggleEditFilter', editFilter: 'addFilter' } ) }
				>
					{ __( '+ Add filter' ) }
				</Button>

				{ state.editFilter === 'addFilter' &&
				<TableFilterPanel
					onEdit={ ( val ) => {
						handleOnEdit( val );
					} }
					customSlug={ slug }
				/>
				}
			</div>
			{ Object.keys( filters ).length !== 0 &&
			<TableFilter
				props={ { state } }
				onEdit={ handleOnEdit }
				onRemove={ ( key ) => {
					handleRemoveFilter( key );
				} }
				customSlug={ slug }
			/>
			}
		</div>
	);
};

export default memo( TableFilters );
