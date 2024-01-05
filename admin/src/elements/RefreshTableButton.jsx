import { memo } from 'react';
import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { filtersArray } from '../hooks/useFilteringSorting';
import useTableStore from '../hooks/useTableStore';
import RefreshButton from './RefreshButton';

function RefreshTableButton( { noCount, defaultSorting } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const slug = useTableStore( ( state ) => state.activeTable );
	const filters = useTableStore( ( state ) => state.tables[ slug ]?.filters || {} );
	const sorting = useTableStore( ( state ) => state.tables[ slug ]?.sorting || defaultSorting || [] );
	const fetchingStatus = useIsFetching( { queryKey: ! noCount ? [ slug, 'count', filtersArray( filters ) ] : [ slug, filtersArray( filters ), sorting ? sorting : [] ] } );

	const handleRefresh = () => {
		queryClient.invalidateQueries( [ slug ] );

		if ( ! noCount ) {
			queryClient.invalidateQueries( [ slug, 'count' ] );
		}
	};

	return (
		<RefreshButton
			tooltipText={ __( 'Refresh table' ) }
			handleRefresh={ handleRefresh }
			className="ml-m"
			loading={ fetchingStatus }
		/>
	);
}

export default memo( RefreshTableButton );
