import { memo } from 'react';
import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { filtersArray } from '../hooks/useFilteringSorting';
import useTableStore from '../hooks/useTableStore';
import RefreshButton from './RefreshButton';

function RefreshTableButton( { noCount } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const slug = useTableStore( ( state ) => state.activeTable );
	const filters = useTableStore().useFilters();
	const sorting = useTableStore().useSorting();
	const fetchingStatus = useIsFetching( { queryKey: ! noCount ? [ slug, 'count', filtersArray( filters ) ] : [ slug, filtersArray( filters ), sorting ? sorting : [] ] } );

	const handleRefresh = () => {
		queryClient.invalidateQueries( {
			predicate: ( query ) =>
				query.queryKey[ 0 ] === slug && query.queryKey[ 1 ] !== 'count',
		} );

		if ( ! noCount ) {
			queryClient.invalidateQueries( [ slug, 'count' ] );
		}
	};

	return (
		<RefreshButton
			tooltipText={ __( 'Refresh table', 'urlslab' ) }
			handleRefresh={ handleRefresh }
			className="ml-m"
			loading={ fetchingStatus }
		/>
	);
}

export default memo( RefreshTableButton );
