import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { fetchData } from '../api/fetching';

import Columns from './tableColumns/YouTubeCacheTable';
import Table from '../components/TableComponent';

import Loader from '../components/Loader';

export default function YouTubeCacheTable() {
	const { ref, inView } = useInView();
	const maxRows = 30;

	const {
		data,
		status,
		isSuccess,
		isError,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery( {
		queryKey: [ 'youtube-cache' ],
		queryFn: ( { pageParam = 0 } ) => {
			return fetchData( `youtube-cache?from_videoid=${ pageParam }&rows_per_page=${ maxRows }` );
		},
		getNextPageParam: ( allRows ) => {
			if ( allRows.length < maxRows ) {
				return undefined;
			}
			const lastRowId = allRows[ allRows?.length - 1 ]?.videoid;
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
				isSuccess && ! isError && data?.pages?.flatMap( ( page ) => page ?? [] )
			}
		>
			<button
				ref={ ref }
				onClick={ () => fetchNextPage() }
				disabled={ ! hasNextPage || isFetchingNextPage }
			>
				{ isFetchingNextPage
					? 'Loading more...'
					: hasNextPage
						? 'Load Newer'
						: '' }
			</button>
		</Table>
	);
}
