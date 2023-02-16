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

export default function MediaFilesTable() {
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
		queryKey: [ 'file' ],
		queryFn: ( { pageParam = 0 } ) => {
			return fetchData( `file?from_fileid=${ pageParam }&rows_per_page=${ maxRows }` );
		},
		getNextPageParam: ( allRows ) => {
			if ( allRows.length < maxRows ) {
				return undefined;
			}
			const lastRowId = allRows[ allRows?.length - 1 ]?.fileid;
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
		console.log( { selected: cell.row.original.fileid } );
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
		columnHelper?.accessor( 'filename', {
			header: () => __( 'File Name' ),
		} ),
		columnHelper?.accessor( 'filetype', {
			header: () => __( 'File Type' ),
		} ),
		columnHelper?.accessor( 'status_changed', {
			header: () => __( 'Status changed' ),
		} ),
		columnHelper?.accessor( 'filestatus', {
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) } />,
			header: () => __( 'Status' ),
		} ),
		columnHelper?.accessor( 'height', {
			header: () => __( 'Height' ),
		} ),
		columnHelper?.accessor( 'width', {
			header: () => __( 'Width' ),
		} ),
		columnHelper?.accessor( 'filesize', {
			header: () => __( 'File Size' ),
		} ),
		columnHelper?.accessor( 'file_usage_count', {
			header: () => __( 'File Usage' ),
		} ),
		columnHelper?.accessor( 'url', {
			header: () => __( 'URL' ),
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
