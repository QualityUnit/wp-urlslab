/*
*   Hook to get column types for filtering from API
*/

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFetch } from '../api/fetching';

const useColumnTypesQuery = ( slug, noFiltering ) => {
	const queryClient = useQueryClient();
	const cache = ! noFiltering && slug && queryClient.getQueryData( [ `${ slug }/columnTypes` ] );
	const { data: columnTypes, isSuccess: isSuccessColumnTypes, isLoading: isLoadingColumnTypes } = useQuery( {
		queryKey: [ `${ slug }/columnTypes` ],
		queryFn: async () => {
			if ( cache ) { // Avoid refetching if we already have cached data on mount
				return cache;
			}
			const rsp = ! cache && ! noFiltering && slug && await getFetch( `${ slug }/columns` );
			if ( rsp.ok ) {
				return await rsp.json();
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		cacheTime: 'Infinity',
	} );

	return { columnTypes, isSuccessColumnTypes, isLoadingColumnTypes };
};

export default useColumnTypesQuery;
