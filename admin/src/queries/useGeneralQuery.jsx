/*
*   Hook to access general options data
*/

import { useQuery } from '@tanstack/react-query';
import { fetchSettings } from '../api/settings';

const useGeneralQuery = () => {
	return useQuery( {
		queryKey: [ 'general' ],
		queryFn: async () => {
			const response = await fetchSettings( 'general' );
			return response;
		},
		refetchOnWindowFocus: false,
	} );
};

export default useGeneralQuery;
