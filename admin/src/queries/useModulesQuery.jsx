/*
*   Hook to access all data of modules query
*/

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFetch } from '../api/fetching';

const useModulesQuery = () => {
	return useQuery( {
		queryKey: [ 'modules' ],
		queryFn: fetchModules,
		refetchOnWindowFocus: false,
	} );
};

export const useModulesQueryPrefetch = () => {
	const queryClient = useQueryClient();

	queryClient.prefetchQuery( {
		queryKey: [ 'modules' ],
		queryFn: fetchModules,
		refetchOnWindowFocus: false,
	} );
};

const fetchModules = async () => {
	const response = await getFetch( 'module' ).then( ( data ) => data );
	if ( response.ok ) {
		return response.json();
	}
};

export default useModulesQuery;

