import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useInView } from 'react-intersection-observer';
import { fetchData } from '../api/fetching';

import Columns from './tableColumns/KeywordsTable';
import Table from '../components/TableComponent';
import ImportExport from '../components/ImportExport';

import Loader from '../components/Loader';

export default function KeywordsTable( { slug } ) {
	const { ref, inView } = useInView();
	const maxRows = 50;

	const {
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		fetchNextPage,
	} = useInfiniteQuery( {
		queryKey: [ slug ],
		queryFn: ( { pageParam = 0 } ) => {
			return fetchData( `${ slug }?from_kw_id=${ pageParam }&rows_per_page=${ maxRows }` );
		},
		getNextPageParam: ( allRows ) => {
			if ( allRows.length < maxRows ) {
				return undefined;
			}
			const lastRowId = allRows[ allRows?.length - 1 ]?.kw_id ?? undefined;
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
		<>
			<ImportExport
				importOptions={ {
					url: slug,
				} }
				exportOptions={ {
					url: slug,
					fromId: 'from_kw_id',
					pageId: 'kw_id',
					deleteCSVCols: [ 'kw_id', 'destUrlMd5' ],
				} } />
			<Table className="fadeInto"
				slug={ slug }
				columns={ Columns() }
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
			>
				<div ref={ ref }>{ isFetchingNextPage && 'Loading more...' }</div>
			</Table>
		</>
	);
}
