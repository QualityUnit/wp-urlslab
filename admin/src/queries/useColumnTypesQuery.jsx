/*
*   Hook to get column types for filtering
*/

import { useQuery } from '@tanstack/react-query';
import { getFetch } from '../api/fetching';

const useColumnTypesQuery = ( slug ) => {
	const { data: columnTypes } = useQuery( {
		queryKey: [ `${ slug }/columnTypes` ],
		queryFn: async () => {
			const rsp = await getFetch( `${ slug }/columns` );
			if ( rsp.ok ) {
				return await rsp.json();
			}
		},
		refetchOnWindowFocus: false,
	} );

	return { columnTypes };
};

export default useColumnTypesQuery;
