import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchData } from '../api/fetching';

export function useInfiniteFetch( options, maxRows = 50 ) {
	const { key, url, pageId } = options;
	const query = useInfiniteQuery( {
		queryKey: [ key, url ],
		queryFn: ( { pageParam = '' } ) => {
			return fetchData( `${ key }?from_kw_id=${ pageParam }&${ url }&rows_per_page=${ maxRows }` );
		},
		getNextPageParam: ( allRows ) => {
			if ( allRows.length < maxRows ) {
				return undefined;
			}
			const lastRowId = allRows[ allRows?.length - 1 ][ pageId ] ?? undefined;
			return lastRowId;
		},
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		cacheTime: Infinity,
		staleTime: Infinity,
	}
	);

	return query;
}
