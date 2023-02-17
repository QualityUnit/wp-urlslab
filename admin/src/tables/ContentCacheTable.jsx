import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { fetchData } from '../api/fetching';

import Columns from './tableColumns/ContentCacheTable';
import Table from '../components/TableComponent';

import Loader from '../components/Loader';

export default function ContentCacheTable() {
	const { ref, inView } = useInView();
	const maxRows = 50;

	const {
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		fetchNextPage,
	} = useInfiniteQuery( {
		queryKey: [ 'content-cache' ],
		queryFn: ( { pageParam = 0 } ) => {
			return fetchData( `content-cache?from_cache_crc32=${ pageParam }&rows_per_page=${ maxRows }` );
		},
		getNextPageParam: ( allRows ) => {
			if ( allRows.length < maxRows ) {
				return undefined;
			}
			const lastRowId = allRows[ allRows?.length - 1 ]?.cache_crc32 ?? undefined;
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

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<Table className="fadeInto" columns={ Columns() }
			data={
				isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
			}
		>
			<div ref={ ref }>{ isFetchingNextPage && 'Loading more...' }</div>
		</Table>
	);
}
