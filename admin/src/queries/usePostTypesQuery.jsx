/**
 * Hook to handle WP Post Types query
 */

import { useQuery } from '@tanstack/react-query';
import { getPostTypes } from '../api/generatorApi';

const usePostTypesQuery = () => {
	return useQuery( {
		queryKey: [ 'post_types' ],
		queryFn: async () => await getPostTypes(),
		refetchOnWindowFocus: false,
	} );
};

export default usePostTypesQuery;
