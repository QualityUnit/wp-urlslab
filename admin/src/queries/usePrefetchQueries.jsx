/*
*   Hook to prefetch data on main app load
*/

import { useQueryClient } from '@tanstack/react-query';
import { getFetch, postFetch } from '../api/fetching';
import { fetchLangs } from '../api/fetchLangs';
import hexToHSL from '../lib/hexToHSL';

const usePrefetchQueries = () => {
	const queryClient = useQueryClient();

	// Creating languages query object in advance
	queryClient.prefetchQuery( {
		queryKey: [ 'languages' ],
		queryFn: async () => await fetchLangs(),
		refetchOnWindowFocus: false,
	} );

	/* 	Creating all endpoints query object in advance
		to check for allowed+required import/insert/edit CSV fields */
	queryClient.prefetchQuery( {
		queryKey: [ 'routes' ],
		queryFn: async () => {
			const response = await getFetch();
			if ( response.ok ) {
				return response.json();
			}
		},
		refetchOnWindowFocus: false,
	} );

	// Prefilling Roles menu
	queryClient.prefetchQuery( {
		queryKey: [ 'roles' ],
		queryFn: async () => {
			const response = await getFetch( 'permission/role' );
			if ( response.ok ) {
				return response.json();
			}
		},
		refetchOnWindowFocus: false,
	} );

	// // Prefilling Capabilities menu
	queryClient.prefetchQuery( {
		queryKey: [ 'capabilities' ],
		queryFn: async () => {
			const response = await getFetch( 'permission/capability' );
			if ( response.ok ) {
				return response.json();
			}
		},
		refetchOnWindowFocus: false,
	} );

	queryClient.prefetchQuery( {
		queryKey: [ 'postTypes' ],
		queryFn: async () => {
			const response = await getFetch( 'module/postTypes' );
			if ( response.ok ) {
				return response.json();
			}
		},
		refetchOnWindowFocus: false,
	} );

	// Creating Tags/Labels query object in advance
	queryClient.prefetchQuery( {
		queryKey: [ 'label', 'menu' ],
		queryFn: async () => {
			const tags = await postFetch( 'label', { rows_per_page: 500 } );
			const tagsArray = await tags.json();
			tagsArray?.map( ( tag ) => {
				const { lightness } = hexToHSL( tag.bgcolor );
				if ( lightness < 70 ) {
					return tag.className = 'dark';
				}
				return tag;
			} );
			return tagsArray;
		},
		cacheTime: 1000,
		staleTime: 0,
		refetchOnWindowFocus: false,
	} );

	// Creating Tags/Labels query object in advance
	queryClient.prefetchQuery( {
		queryKey: [ 'label', 'modules' ],
		queryFn: async () => {
			const response = await getFetch( 'label/modules' );
			if ( response.ok ) {
				return response.json();
			}

			return {};
		},
		refetchOnWindowFocus: false,
	} );
};

export default usePrefetchQueries;

