import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useInView } from 'react-intersection-observer';
import { useI18n } from '@wordpress/react-i18n';
import { fetchData } from '../api/fetching';
import { langName } from '../constants/helpers';

import SortMenu from '../elements/SortMenu';
import LangMenu from '../elements/LangMenu';
import InputField from '../elements/InputField';
import Checkbox from '../elements/Checkbox';
import Table from '../components/TableComponent';

import Loader from '../components/Loader';

export default function KeywordsTable() {
	const { __ } = useI18n();
	const columnHelper = createColumnHelper();
	const { ref, inView } = useInView();
	const maxRows = 50;

	const {
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery( {
		queryKey: [ 'keyword' ],
		queryFn: ( { pageParam = 0 } ) => {
			return fetchData( `keyword?from_kw_id=${ pageParam }&rows_per_page=${ maxRows }` );
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

	const handleInput = ( value, cell ) => {
		const newRow = cell.row.original;
		newRow[ cell.column.id ] = value;
		console.log( newRow );
	};

	const handleSelected = ( val, cell ) => {
		cell.row.toggleSelected();
		console.log( { selected: cell.row.original.kw_id } );
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
		columnHelper.accessor( 'keyword', {
			header: () => __( 'Keyword' ),
		} ),
		columnHelper.accessor( 'kwType', {
			cell: ( cell ) => <SortMenu
				items={ { M: __( 'Manual' ), I: __( 'Imported' ), X: __( 'None' ) } }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) }
			/>,
			header: () => __( 'Keyword Type' ),
		} ),
		columnHelper.accessor( 'kw_length', {
			header: () => __( 'Keyword Length' ),
		} ),
		columnHelper.accessor( 'kw_priority', {
			header: () => __( 'Keyword Priority' ),
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			header: () => __( 'Keyword Usage' ),
		} ),
		columnHelper.accessor( 'lang', {
			cell: ( val ) => <LangMenu checkedId={ val?.getValue() } onChange={ ( lang ) => console.log( lang ) } />,
			header: () => __( 'Language' ),
		} ),
		columnHelper.accessor( 'link_usage_count', {
			header: () => __( 'Link Usage' ),
		} ),
		columnHelper.accessor( 'urlFilter', {
			cell: ( cell ) => <InputField type="text"
				defaultValue={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) }
			/>,
			header: () => __( 'URL Filter' ),
		} ),
		columnHelper.accessor( 'urlLink', {
			header: () => __( 'Keyword Link' ),
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
