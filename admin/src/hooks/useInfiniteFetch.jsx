import { useMemo, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useInView } from 'react-intersection-observer';

import { useInfiniteQuery } from '@tanstack/react-query';
import { postFetch } from '../api/fetching';
import { filtersArray, sortingArray } from './useFilteringSorting';
import useTableStore from './useTableStore';

export default function useInfiniteFetch( options, maxRows = 50 ) {
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { ref, inView } = useInView();
	const { slug: key, customFetchOptions, wait } = options;

	const paginationId = useTableStore( ( state ) => state.tables[ key ]?.paginationId );
	const filters = useTableStore().useFilters( key );
	let fetchOptions = useTableStore().useFetchOptions( key );
	if ( customFetchOptions ) {
		fetchOptions = customFetchOptions;
	}
	const sorting = useTableStore().useSorting( key );
	const allowTableFetchAbort = useTableStore( ( state ) => state.tables[ key ]?.allowTableFetchAbort );

	const query = useInfiniteQuery( {
		queryKey: [ key, filtersArray( filters ), sorting, fetchOptions ],
		queryFn: async ( { pageParam = '', signal } ) => {
			const { lastRowId, sortingFilters, sortingFiltersLastValue } = pageParam;
			if ( ! wait ) {
				const response = await postFetch(
					key,
					{
						...fetchOptions,
						sorting: [ ...sortingArray( key ), { col: paginationId, dir: 'ASC' } ],
						filters: sortingFilters
							? [
								{ cond: 'OR',
									filters: [
										{ cond: 'AND', filters: [ ...sortingFiltersLastValue, { col: paginationId, op: '>', val: lastRowId } ] },
										...sortingFilters,
									],
								},
								...filtersArray( filters ),
							]
							: [ ...filtersArray( filters ) ],
						rows_per_page: maxRows,
					},
					{ ...( allowTableFetchAbort ? { signal } : null ) }
				);
				if ( response.ok ) {
					return response.json();
				}
			}
			return [];
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
		refetchOnMount: true,
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
		isLoading,
		fetchNextPage,
	} = query;

	useEffect( () => {
		if ( inView ) {
			fetchNextPage();
		}
	}, [ inView, key, fetchNextPage ] );

	return {
		columnHelper,
		data,
		status,
		isSuccess,
		isLoading,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		ref,
	};
}
