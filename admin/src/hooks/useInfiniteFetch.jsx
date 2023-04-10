import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';
import { useInView } from 'react-intersection-observer';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchData } from '../api/fetching';
import { getParamsChar } from "../lib/helpers";

export default function useInfiniteFetch( options, maxRows = 50 ) {
	const columnHelper = createColumnHelper();
	const { __ } = useI18n();
	const { ref, inView } = useInView();
	const { key, url, pageId } = options;

	const query = useInfiniteQuery( {
		queryKey: [ key, url ? url : '' ],
		queryFn: ( { pageParam = '' } ) => {
			return fetchData( `${ key }`+getParamsChar()+`from_${ pageId }=${ pageParam !== undefined && pageParam }${ url !== 'undefined' ? url : '' }&rows_per_page=${ maxRows }` );
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
	} );

	const {
		data,
		status,
		isSuccess,
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
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage, ref };
}
