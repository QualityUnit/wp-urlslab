/**
 * Hook to handle WP Post Types query
 */

import { useQuery } from '@tanstack/react-query';
import { getPostTypes } from '../api/generatorApi';

const usePostTypesQuery = () => {
	return useQuery( {
		queryKey: [ 'post_types' ],
		queryFn: async () => {
			const result = await getPostTypes();
			if ( result.ok ) {
				return await result.json();
			}
			return {};
		},
		refetchOnWindowFocus: false,
	} );
};

export default usePostTypesQuery;
