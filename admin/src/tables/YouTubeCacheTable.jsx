import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useInView } from 'react-intersection-observer';
import { useI18n } from '@wordpress/react-i18n';
import { fetchData } from '../api/fetching';

import Checkbox from '../elements/Checkbox';
import SortMenu from '../elements/SortMenu';
import Table from '../components/TableComponent';

import Loader from '../components/Loader';

export default function YouTubeCacheTable() {
	const { __ } = useI18n();
	const columnHelper = createColumnHelper();
	const { ref, inView } = useInView();
	const maxRows = 30;

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};

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

	const handleInput = ( value, cell ) => {
		const newRow = cell.row.original;
		newRow[ cell.column.id ] = value;
		console.log( newRow );
	};

	const handleSelected = ( val, cell ) => {
		cell.row.toggleSelected();
		console.log( { selected: cell.row.original.videoid } );
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
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
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) } />,
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
		<Table className="fadeInto" columns={ columns }
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
