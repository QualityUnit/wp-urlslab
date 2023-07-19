/*
*   Hook to access all data of credits query
*/

import { useQuery } from '@tanstack/react-query';
import { postFetch } from '../api/fetching';

const useCreditsQuery = () => {
	return useQuery( {
		queryKey: [ 'credits' ],
		queryFn: async () => {
			const response = await postFetch( `billing/credits`, { rows_per_page: 50 } );
			return response.json();
		},
		refetchOnWindowFocus: false,
		retry: 1,
		refetchInterval: 60 * 60 * 1000, // refresh every hour
	} );
};

export default useCreditsQuery;

