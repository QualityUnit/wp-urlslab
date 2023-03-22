import { useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';
import { useInView } from 'react-intersection-observer';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchData } from '../api/fetching';
import { get, set } from 'idb-keyval';

export default function useInfiniteFetch( options, maxRows = 50 ) {
	const columnHelper = createColumnHelper();
	const { __ } = useI18n();
	const { ref, inView } = useInView();
	const { key, url, pageId, currentFilters } = options;
	const [ queryUrl, setQueryUrl ] = useState();
	// const [ activeFilters, setActiveFilters ] = useState( {} );

	const query = useInfiniteQuery( {
		queryKey: [ key, url ? url : queryUrl ],
		queryFn: ( { pageParam = '' } ) => {
			get( key ).then( ( tableDb ) => {
				if ( ! tableDb ) {
					set( key, { url, currentFilters } );
				}
				if ( tableDb ) {
					set( key, { ...tableDb, url, currentFilters } );
				}
			} );
			return fetchData( `${ key }?from_${ pageId }=${ pageParam }${ url }&rows_per_page=${ maxRows }` );
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
		get( key ).then( ( tableQuery ) => {
			const q = tableQuery;
			setQueryUrl( q?.url );
			// setActiveFilters( Object.keys( q?.currentFilters ).length ? q?.currentFilters : {} );
		} );
		if ( inView ) {
			fetchNextPage();
		}
	}, [ inView, key, fetchNextPage ] );

	return {
		__,
		columnHelper,
		data,
		// activeFilters,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage, ref };
}
