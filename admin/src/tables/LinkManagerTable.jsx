import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useInView } from 'react-intersection-observer';
import { useI18n } from '@wordpress/react-i18n';
import { fetchData } from '../api/fetching';

import SortMenu from '../elements/SortMenu';
import LangMenu from '../elements/LangMenu';
import InputField from '../elements/InputField';
import Checkbox from '../elements/Checkbox';
import Table from '../components/TableComponent';

import Loader from '../components/Loader';

export default function LinkManagerTable() {
	const { __ } = useI18n();
	const columnHelper = createColumnHelper();
	const { ref, inView } = useInView();
	const maxRows = 50;

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
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery( {
		queryKey: [ 'url' ],
		queryFn: ( { pageParam = 0 } ) => {
			return fetchData( `url?from_urlId=${ pageParam }&rows_per_page=${ maxRows }` );
		},
		getNextPageParam: ( allRows ) => {
			if ( allRows.length < maxRows ) {
				return undefined;
			}
			const lastRowId = allRows[ allRows?.length - 1 ]?.urlId ?? undefined;
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
		console.log( { selected: cell.row.original.urlId } );
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
		columnHelper.accessor( 'urlTitle', {
			header: () => __( 'URL Title' ),
		} ),
		columnHelper.accessor( 'urlName', {
			header: () => __( 'URL' ),
		} ),
		columnHelper?.accessor( 'urlMetaDescription', {
			header: () => __( 'URL Description' ),
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
		columnHelper.accessor( 'updateStatusDate', {
			header: () => __( 'Status Date' ),
		} ),
	];
	return (
		<Table className="fadeInto" columns={ columns }
			data={
				isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
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
