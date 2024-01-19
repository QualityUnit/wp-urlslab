/*
*   Hook to get data for charts
*/

import { useQuery } from '@tanstack/react-query';
import { postFetch } from '../api/fetching';

const useChartQuery = ( slug, data, dataHandler ) => {
	return useQuery( {
		queryKey: [ slug, data ],
		queryFn: async ( { signal } ) => {
			const response = await postFetch( slug, data, { signal } );
			if ( response.ok ) {
				const responseData = await response.json();
				if ( dataHandler ) {
					return dataHandler( responseData );
				}
				return responseData;
			}
			return null;
		},
		refetchOnWindowFocus: false,
		keepPreviousData: true,
		cacheTime: Infinity,
		staleTime: Infinity,
	} );
};

export default useChartQuery;
