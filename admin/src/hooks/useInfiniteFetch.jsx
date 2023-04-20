import { useMemo, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';
import { useInView } from 'react-intersection-observer';

import { useInfiniteQuery } from '@tanstack/react-query';
import { postFetch } from '../api/fetching';

export default function useInfiniteFetch( options, maxRows = 50 ) {
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { __ } = useI18n();
	const { ref, inView } = useInView();
	const { key, filters: userFilters, sorting, paginationId } = options;

	const filtersArray = userFilters ? Object.entries( userFilters ).map( ( [ col, params ] ) => {
		const { op, val } = params;
		return { col, op, val };
	} ) : [];
	console.log( [ ...filtersArray ] );

	const query = useInfiniteQuery( {
		queryKey: [ key, filtersArray ],
		// queryKey: [ key, Object.keys( filters ).length > 0 && filters, sorting ],
		queryFn: ( { pageParam = '' } ) => {
			return postFetch( key, { sorting: [ { col: paginationId, dir: 'ASC' } ], filters: pageParam ? [ ...filtersArray, { col: paginationId, op: '>', val: pageParam } ] : [ ...filtersArray ], rows_per_page: maxRows } ).then( ( response ) => response.json() );
		},
		getNextPageParam: ( allRows ) => {
			if ( allRows.length < maxRows ) {
				return undefined;
			}
			const lastRowId = allRows[ allRows?.length - 1 ][ paginationId ] ?? undefined;
			return lastRowId;
		},
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		cacheTime: Infinity,
		staleTime: Infinity,
	} );

	const {
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage } = query;

	useEffect( () => {
		if ( inView ) {
			fetchNextPage();
		}
	}, [ inView, key, fetchNextPage ] );

	return {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage, ref };
}
