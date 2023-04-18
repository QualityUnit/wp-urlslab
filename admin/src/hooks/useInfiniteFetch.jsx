import { useMemo, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';
import { useInView } from 'react-intersection-observer';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTableData } from '../api/fetching';

export default function useInfiniteFetch( apiPath, primaryColumnNames, filters = [], sorting = [], maxRows = 50 ) {
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { __ } = useI18n();
	const { ref, inView } = useInView();

	const query = useInfiniteQuery( {
		queryKey: [ apiPath ],
		queryFn: ( { lastRow } ) => {
			let queryFilters = [].concat(filters);//clone filters

			primaryColumnNames.forEach(
				function(primaryColumnName){
					//TODO sorting direction should update filter operator!
					queryFilters.push( { col: primaryColumnName, op: '>', val: lastRow[ primaryColumnName ] } );
				}
			);

			return fetchTableData( apiPath, queryFilters, sorting, maxRows );
		},
		getNextPageParam: ( allRows ) => {
			if ( allRows.length < maxRows ) {
				return undefined;
			}
			return allRows[ allRows?.length - 1 ] ?? undefined;
		},
		keepPreviousData: true,
		refetchOnWindowFocus: true,
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
	}, [ inView, apiPath, fetchNextPage ] );

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
