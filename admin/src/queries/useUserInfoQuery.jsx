/*
*   Hook to access user related data
*/

import { useQuery } from '@tanstack/react-query';
import { getFetch } from '../api/fetching';

const queryKey = 'user-info';

const useUserInfoQuery = () => {
	return useQuery( {
		queryKey: [ queryKey ],
		queryFn: async () => {
			const response = await getFetch( queryKey );
			if ( response.ok ) {
				return response.json();
			}
			return null;
		},
		refetchOnWindowFocus: false,
	} );
};

export default useUserInfoQuery;
