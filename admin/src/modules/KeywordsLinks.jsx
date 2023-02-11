import { useEffect, useState, Suspense, lazy } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import {
	persistQueryClient,
} from '@tanstack/react-query-persist-client';
import { createColumnHelper } from '@tanstack/react-table';
import { useI18n } from '@wordpress/react-i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useCSVReader, useCSVDownloader } from 'react-papaparse';
import { fetchData, setData } from '../api/fetching';
import { fetchWPML } from '../api/fetchLangs';
import { langName } from '../constants/helpers';
import Loader from '../components/Loader';
import SortMenu from '../elements/SortMenu';
import InputField from '../elements/InputField';
import Checkbox from '../elements/Checkbox';
import TableViewHeader from '../components/TableViewHeader';
import Table from '../components/TableComponent';
import Settings from './Settings';

export default function KeywordLinks( { moduleId } ) {
	const { __ } = useI18n();
	const { CSVReader } = useCSVReader();
	const { CSVDownloader, Type } = useCSVDownloader();
	const queryClient = useQueryClient();
	const columnHelper = createColumnHelper();
	const { ref, inView } = useInView();

	const [ csvMessage, setCSVMessage ] = useState( null );
	const [ activeSection, setActiveSection ] = useState( 'overview' );
	const maxRows = 50;

	// persistQueryClient( {
	// 	queryClient,
	// 	buster: 'keyword',
	// } );

	const {
		data,
		status,
		isFetching,
		isSuccess,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery( [ 'tableKeyword' ],
		( { pageParam = '' } ) => {
			return fetchData( `keyword?from_kw_id=${ pageParam }&rows_per_page=${ maxRows }` );
		},
		{
			getNextPageParam: ( allRows ) => {
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

	const importLocal = ( parsedData ) => {
		// console.log( queryClient.getQueryData( [ 'tableKeyword' ] ) );
		// console.log( parsedData );
		setCSVMessage( __( 'Processing data…' ) );
		queryClient.setQueryData( [ 'tableKeyword' ], parsedData );
		setCSVMessage( null );
	};

	const importData = useMutation( {
		mutationFn: ( results ) => {
			setCSVMessage( __( 'Uploading data…' ) );

			return setData( 'keyword/import',
				results.data
			);
		},
		onSuccess: () => {
			setCSVMessage( __( 'Data uploaded' ) );
			queryClient.invalidateQueries( [ 'tableKeyword' ] );
			setTimeout( () => {
				setCSVMessage( null );
			}, 300 );
		},
	} );

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
			cell: ( val ) => langName( val?.getValue() ),
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

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<TableViewHeader activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
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
								: 'Nothing more to load' }
					</button>
				</Table>
			}
			{
				activeSection === 'settings' &&

					<Suspense>
						<SettingsModule className="fadeInto" settingId={ moduleId } />
					</Suspense>

			}
			{
				activeSection === 'importexport' &&
				<div>Import Export</div>
			}
		</div>
	);
}
