import { useQueryClient, useQuery } from '@tanstack/react-query';
import { postFetch } from '../api/fetching';
import hexToHSL from '../lib/hexToHSL';

export default function useTags( ) {
	const queryClient = useQueryClient();
	const { data: tagsData, refetch } = useQuery( {
		queryKey: [ 'label', 'menu' ],
		queryFn: async () => {
			const tagsFetch = await postFetch( 'label', { rows_per_page: 50 } );
			const tagsArray = await tagsFetch.json();
			tagsArray?.map( ( tag ) => {
				const { lightness } = hexToHSL( tag.bgcolor );
				if ( lightness < 70 ) {
					return tag.className = 'dark';
				}
				return tag;
			} );
			return tagsArray;
		},
		refetchOnWindowFocus: false,
		initialData: queryClient.getQueryData( [ 'label', 'menu' ] ),
	} );

	return { tagsData, refetchTags: refetch };
}
