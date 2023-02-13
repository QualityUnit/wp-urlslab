import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { createColumnHelper } from '@tanstack/react-table';
import { useI18n } from '@wordpress/react-i18n';
import { fetchData } from '../api/fetching';
import Loader from '../components/Loader';
import Table from '../components/TableComponent';

export default function LazyLoading() {
	const { __ } = useI18n();
	const columnHelper = createColumnHelper();
	const { ref, inView } = useInView();
	const maxRows = 30;

	const {
		data,
		status,
		isFetching,
		isSuccess,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery( [ 'youtube-cache' ],
		( { pageParam = '' } ) => {
			return fetchData( `youtube-cache?from_videoid=${ pageParam }&rows_per_page=${ maxRows }` );
		},
		{
			getNextPageParam: ( allRows ) => {
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

	const columns = [
		columnHelper?.accessor( ( row ) => JSON.parse( `${ row?.microdata }` )?.items[ 0 ]?.snippet, {
			id: 'thumb',
			className: 'thumbnail',
			cell: ( image ) => <img src={ image?.getValue()?.thumbnails?.default?.url } alt={ image?.getValue()?.title
			} />,
			header: () => __( 'Thumbnail' ),
		} ),
		columnHelper?.accessor( 'videoid', {
			header: () => __( 'YouTube Id' ),
		} ),
		columnHelper?.accessor( 'status', {
			cell: ( stat ) => <span className={ `youtube-status-bullet youtube-status-bullet-${ stat?.getValue() }` }>{ stat.getValue() }</span>,
			className: 'youtube-status',
			header: () => __( 'Status' ),
		} ),
		columnHelper?.accessor( ( row ) => [ row?.videoid, JSON.parse( `${ row?.microdata }` )?.items[ 0 ]?.snippet?.title ], {
			id: 'title',
			cell: ( val ) => <a href={ `https://youtu.be/${ val?.getValue()[ 0 ] }` } target="_blank" rel="noreferrer">{ val?.getValue()[ 1 ] }</a>,
			header: () => __( 'Title' ),
		} ),
		columnHelper?.accessor( ( row ) => JSON.parse( `${ row?.microdata }` )?.items[ 0 ]?.snippet?.publishedAt, {
			id: 'published',
			cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
			header: () => __( 'Published' ),
		} ),
	];

	return (
		<Table columns={ columns }
			data={
				isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
			}
		>
			{ hasNextPage
				? <div>
					<button
						ref={ ref }
						onClick={ () => fetchNextPage() }
						disabled={ ! hasNextPage || isFetchingNextPage }
					>
						{ isFetchingNextPage
							? 'Loading more...'
							: hasNextPage
								? 'Load Newer'
								: 'Nothing more to load' }
					</button>
				</div>
				: ''
			}
			<div>
				{ isFetching && ! isFetchingNextPage
					? 'Background Updating...'
					: null }
			</div>
		</Table>
	);
}
