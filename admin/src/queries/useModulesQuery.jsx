/*
*   Hook to access all data of modules query
*/

import { useQuery } from '@tanstack/react-query';
import { getFetch } from '../api/fetching';

const useModulesQuery = () => {
	return useQuery( {
		queryKey: [ 'modules' ],
		queryFn: async () => {
			const response = await getFetch( 'module' ).then( ( data ) => data );
			if ( response.ok ) {
				return response.json();
			}
		},
		refetchOnWindowFocus: false,
	} );
};

export default useModulesQuery;

