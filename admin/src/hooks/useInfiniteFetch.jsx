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

	const sortingArray = sorting ? sorting.map( ( sortingObj ) => {
		const { key: keyName, dir } = sortingObj;
		return { col: keyName, dir };
	} ) : [];

	const query = useInfiniteQuery( {
		queryKey: [ key, userFilters, sorting ],
		// queryKey: [ key, Object.keys( filters ).length > 0 && filters, sorting ],
		queryFn: async ( { pageParam = '' } ) => {
			const { lastRowId, sortingFilters } = pageParam;
			const response = await postFetch( key, {
				sorting: [ ...sortingArray, { col: paginationId, dir: 'ASC' } ],
				filters: lastRowId ? [ ...filtersArray, ...sortingFilters, { col: paginationId, op: '>', val: lastRowId } ] : [ ...filtersArray ], rows_per_page: maxRows } );
			return response.json();
		},
		getNextPageParam: ( allRows ) => {
			if ( allRows.length < maxRows ) {
				return undefined;
			}
			const lastRowId = allRows[ allRows?.length - 1 ][ paginationId ] ?? undefined;
			const sortingFilters = sorting ? sorting.map( ( sortingObj ) => {
				const { key: keyName, op } = sortingObj;
				return { col: keyName, op, val: allRows[ allRows?.length - 1 ][ keyName ] };
			} ) : [];
			return { lastRowId, sortingFilters };
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
