/*
*   Hook to get supported AI models
*/

import { useQuery } from '@tanstack/react-query';
import { getFetch } from '../api/fetching';

const useAIModelsQuery = () => {
	return useQuery( {
		queryKey: [ 'generator/models' ],
		queryFn: async () => {
			const rsp = await getFetch( 'generator/models' );
			if ( rsp.ok ) {
				return await rsp.json();
			}
		},
		refetchOnWindowFocus: false,
	} );
};

export default useAIModelsQuery;
