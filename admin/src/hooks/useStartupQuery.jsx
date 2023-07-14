/*
*   Hook to handle loading start up data
*/

import { useQuery } from '@tanstack/react-query';
import { fetchSettings } from '../api/settings';

const useStartupQuery = () => {
	return useQuery( {
		queryKey: [ 'general' ],
		queryFn: async () => {
			const response = await fetchSettings( 'general' );
			return response;
		},
		refetchOnWindowFocus: false,
	} );
};

export default useStartupQuery;
