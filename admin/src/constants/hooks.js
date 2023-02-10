import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfiniteFetch( url, maxRows ) {
	const {
		data,
		status,
		isFetching,
		isSuccess,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery( [ 'tableKeyword' ],
		( { pageParam = '' } ) => {
			return fetchData( `keyword?rows_per_page=${ maxRows }from_kw_id=${ pageParam }&` );
		},
		{
			getNextPageParam: ( allRows ) => {
				const lastRowId = allRows[ allRows?.length - 1 ]?.kw_id ?? undefined;
				return lastRowId;
			},
			keepPreviousData: true,
			refetchOnWindowFocus: false,
			cacheTime: Infinity,
			staleTime: Infinity,
		}
	);
	useEffect( () => {
		if ( inView ) {
			fetchNextPage();
		}
	}, [ inView, fetchNextPage ] );

	return { data, status, isFetching, isSuccess, isFetchingNextPage, fetchNextPage, hasNextPage };
}
