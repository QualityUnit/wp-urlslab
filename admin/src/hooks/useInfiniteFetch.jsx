import { useMemo, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useInView } from 'react-intersection-observer';

import { useInfiniteQuery } from '@tanstack/react-query';
import { postFetch } from '../api/fetching';
import filtersArray from '../lib/filtersArray';
import useTableStore from './useTableStore';

export default function useInfiniteFetch( options, maxRows = 50 ) {
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { ref, inView } = useInView();
	const { slug: key } = options;

	const paginationId = useTableStore( ( state ) => state.paginationId );
	const userFilters = useTableStore( ( state ) => state.filters );
	const sorting = useTableStore( ( state ) => state.sorting );

	const sortingArray = sorting ? sorting.map( ( sortingObj ) => {
		const { key: keyName, dir } = sortingObj;
		return { col: keyName, dir };
	} ) : [];

	const query = useInfiniteQuery( {
		queryKey: [ key, filtersArray( userFilters ), sorting ],
		queryFn: async ( { pageParam = '' } ) => {
			const { lastRowId, sortingFilters, sortingFiltersLastValue } = pageParam;
			const response = await postFetch( key, {
				sorting: [ ...sortingArray, { col: paginationId, dir: 'ASC' } ],
				filters: sortingFilters
					? [
						{ cond: 'OR',
							filters: [
								{ cond: 'AND', filters: [ ...sortingFiltersLastValue, { col: paginationId, op: '>', val: lastRowId } ] },
								...sortingFilters,
							],
						},
						...filtersArray( userFilters ),
					]
					: [ ...filtersArray( userFilters ) ],
				rows_per_page: maxRows,
			} );
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
			const sortingFiltersLastValue = sorting ? sorting.map( ( sortingObj ) => {
				const { key: keyName } = sortingObj;
				return { col: keyName, op: '=', val: allRows[ allRows?.length - 1 ][ keyName ] };
			} ) : [];
			return { lastRowId, sortingFilters, sortingFiltersLastValue };
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

	const setFetchingStatus = useTableStore( ( state ) => state.setFetchingStatus );

	useEffect( () => {
		if ( isFetching || isFetchingNextPage ) {
			setFetchingStatus( true );
		}
		if ( ! isFetching || ! isFetchingNextPage ) {
			setFetchingStatus( false );
		}
		if ( inView ) {
			fetchNextPage();
		}
	}, [ inView, key, fetchNextPage ] );

	return {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage, ref };
}
