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
	const { slug: key, customFetchOptions, defaultSorting, wait } = options;

	const paginationId = useTableStore( ( state ) => state.tables[ key ]?.paginationId );
	const userFilters = useTableStore( ( state ) => state.tables[ key ]?.filters || {} );
	const sorting = useTableStore( ( state ) => state.tables[ key ]?.sorting || defaultSorting || [] );
	let fetchOptions = useTableStore( ( state ) => state.tables[ key ]?.fetchOptions || {} );
	const allowTableFetchAbort = useTableStore( ( state ) => state.tables[ key ]?.allowTableFetchAbort || null );

	if ( customFetchOptions ) {
		fetchOptions = customFetchOptions;
	}

	const query = useInfiniteQuery( {
		queryKey: [ key, filtersArray( userFilters ), sorting, fetchOptions ],
		queryFn: async ( { pageParam = '', signal } ) => {
			const { lastRowId, sortingFilters, sortingFiltersLastValue } = pageParam;
			if ( ! wait ) {
				const response = await postFetch(
					key,
					{
						...fetchOptions,
						sorting: [ ...sortingArray( key, defaultSorting ), { col: paginationId, dir: 'ASC' } ],
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
		fetchNextPage } = query;

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
		fetchNextPage, ref };
}
